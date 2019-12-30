// @flow
import fs from 'fs-extra';
import getPort from 'get-port';
import {
  buildLog,
  getDockerRepo,
  dockerImages,
  dockerRun,
  dockerNetworkDelete,
  dockerTryStopContainer,
  run,
  onKillSignal,
} from 'build-strap';
import docker, { getBuildImage, getBuildTag, runDbContainer } from './docker';

// Run the production docker image
export default async function dockerProd(
  build: boolean = process.argv.includes('--build-docker'),
  integration: boolean = !process.argv.includes('--no-integration'),
  persistDbData: boolean = !process.argv.includes('--no-db-persist'),
) {
  await fs.ensureFile('./latest.build.tag');
  const tag = await getBuildTag();
  if (build || !(await dockerImages(getDockerRepo())).find(m => m.tag === tag)) {
    buildLog('Image does not exist, running docker build...');
    await run(docker);
  }

  const network = 'ski-resorts-production';
  let db = null;
  let dbHost = null;
  let dbPort = null;

  let cleaning = null;
  const cleanupAndExit = async () => {
    if (!cleaning) {
      cleaning = (async () => {
        buildLog('Process exiting... cleaning up...');
        await dockerTryStopContainer(db, 'db');
        try {
          await dockerNetworkDelete(network);
        } catch (err) {
          buildLog(`Failed to delete network (probably does not exist): ${err.message}`);
        }
        process.exit();
      })();
    }
    return cleaning;
  };

  onKillSignal(cleanupAndExit);

  try {
    if (integration) {
      ({ alias: dbHost, dockerPort: dbPort, id: db } = await runDbContainer(
        network,
        persistDbData ? './db/data-prod' : null,
      ));
    }

    const dockerPort = 80;
    const localPort = await getPort({ port: 8008, host: '0.0.0.0' });

    buildLog(`Starting server, to be available at https://localhost:${localPort}`);

    // Run the tests in the builder container
    await dockerRun(
      [
        '--rm',
        '-it',
        '-p',
        `${localPort}:${dockerPort}`,
        '-e',
        `PORT=${dockerPort}`,
        ...(integration
          ? [
              ...(dbHost && dbPort
                ? ['-e', 'DB_ENABLED=true', '-e', `DB_HOST=mongodb://${dbHost}:${dbPort}`]
                : []),
              `--network=${network}`,
            ]
          : []),
      ],
      await getBuildImage(tag),
      [],
    );
  } finally {
    // cleanup
    await cleanupAndExit();
  }
}
