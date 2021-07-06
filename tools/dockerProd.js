// @flow
import {
  buildLog,
  dockerContainerRun,
  dockerImages,
  dockerNetworkDelete,
  dockerTryStopContainer,
  getDockerRepo,
  onKillSignal,
  run,
} from 'build-strap';
import fs from 'fs-extra';
import getPort from 'get-port';

import docker, { getBuildImage, getBuildTag, runDbContainer } from './docker';

// Run the production docker image
export default async function dockerProd(
  build: boolean = process.argv.includes('--build-docker'),
  integration: boolean = !process.argv.includes('--no-integration'),
) {
  await fs.ensureFile('./latest.build.tag');
  const tag = await getBuildTag();
  if (build || !(await dockerImages(getDockerRepo())).find((m) => m.tag === tag)) {
    buildLog('Image does not exist, running docker build...');
    await run(docker);
  }

  const network = 'ski-resorts-net';
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
      ({
        aliases: [dbHost],
        dockerPort: dbPort,
        id: db,
      } = await runDbContainer());
    }

    const dockerPort = 80;
    const localPort = await getPort({ port: 8008, host: '0.0.0.0' });

    buildLog(`Starting server, to be available at https://localhost:${localPort}`);

    // Run the tests in the builder container
    await dockerContainerRun({
      runArgs: [
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
      image: await getBuildImage(tag),
    });
  } finally {
    // cleanup
    await cleanupAndExit();
  }
}
