import { dockerRun, run, onKillSignal, buildLog, dockerNetworkCreate } from 'build-strap';
import path from 'path';
import getPort from 'get-port';
import fs from 'fs-extra';

import build from './build';
import test from './test';
import serve from './serve';
import { runDbContainer, ensureBuilder, getBuilderImage, dockerTeardown } from './docker';

/**
 * Development mode. When files change, rebuild, test, and run
 */
export default async function tdd(
  pauseOnCrash = process.argv.includes('--tdd-pause-on-crash'),
  runDatabase = !process.argv.includes('--tdd-no-db') && !process.argv.includes('--tdd-no-docker'),
  persistDbData = !process.argv.includes('--tdd-no-db-persist'),
  dockerize = process.argv.includes('--tdd-docker'),
  testIntegration = process.argv.includes('--test-integration'),
  testDebug = process.argv.includes('--test-debug'),
  debugBreak = process.argv.includes('--break'),
  noDocker = process.argv.includes('--tdd-no-docker'),
  doLint = process.argv.includes('--tdd-lint'),
  doFlow = process.argv.includes('--tdd-flow'),
) {
  // Start nodemon to host server instance
  let server = null;
  let dbPort = null;
  const network = 'ski-resorts-tdd';

  let cleaning = null;
  const cleanupAndExit = async () => {
    if (!cleaning) {
      cleaning = (async () => {
        buildLog('Process exiting... cleaning up...');
        if (server) {
          server.kill();
          server = null;
        }
        await dockerTeardown();
        buildLog('Cleanup finished.');
        process.exit();
      })();
    }
    return cleaning;
  };

  onKillSignal(cleanupAndExit);

  try {
    if (!noDocker) {
      await dockerNetworkCreate(network);
    }
    const containerPromises = [
      (async () => {
        if (runDatabase) {
          await fs.ensureDir('./db/data-tdd');
          ({ port: dbPort } = await runDbContainer(network, persistDbData && './db/data-tdd'));
        }
      })(),
    ];

    if (dockerize) {
      const [builderTag] = await Promise.all([ensureBuilder(), ...containerPromises]);

      const host = '0.0.0.0';
      const dockerPort = 8000;
      const localPort = await getPort({ port: 8000, host });
      const dockerPortDebug = 9229;
      const localPortDebug = await getPort({ port: 9229, host });
      const dockerPortTestDebug = 9222;
      const localPortTestDebug = await getPort({ port: 9222, host });

      buildLog(`
  ##############################################
  # Running tdd in docker:
  # Application hosted at http://localhost:${localPort}
  # Application debug on port ${dockerPortDebug}
  # Test debug on port ${dockerPortTestDebug}
  ##############################################
      `);

      // Run tdd in the builder container
      await dockerRun(
        [
          '--rm',
          '--name',
          'ski-tdd-app',
          '-it',
          '-p',
          `${localPort}:${dockerPort}`,
          '-p',
          `${localPortDebug}:${dockerPortDebug}`,
          '-p',
          `${localPortTestDebug}:${dockerPortTestDebug}`,
          `--network=${network}`,
          '-v',
          `${path.resolve('./src')}:/opt/build/src:rw`,
          '-v',
          `${path.resolve('./package.json')}:/opt/build/package.json:ro`,
          '-v',
          `${path.resolve('./log')}:/opt/build/log:rw`,
          '-v',
          `${path.resolve('./config')}:/opt/build/config:rw`,
          '-v',
          `${path.resolve('./config.dev')}:/opt/build/config.dev:ro`,
        ],
        await getBuilderImage(builderTag),
        [
          'tdd',
          '--poll-fs',
          '--tdd-no-docker',
          ...(pauseOnCrash ? ['--tdd-pause-on-crash'] : []),
          ...(testIntegration ? ['--test-integration'] : []),
          ...(testDebug ? ['--test-debug'] : []),
          ...(debugBreak ? ['--break'] : []),
          ...process.argv.slice(3),
        ],
      );
    } else {
      await Promise.all(containerPromises);
      const extraEnv = {
        ...(runDatabase
          ? {
              DB_ENABLED: true,
              DB_HOST: 'localhost',
              DB_PORT: dbPort,
            }
          : null),
      };

      // Run build in watch mode
      await run(build, true, doLint, doFlow, async () => {
        if (cleaning) throw new Error('Aborting build, process cleaning up.');
        await run(test, true, true, undefined, extraEnv, testDebug, false);
        if (cleaning) throw new Error('Aborting build, process cleaning up.');
        if (!server) {
          server = await run(serve, true, undefined, process.argv.slice(3), false, extraEnv);
          let startTime = new Date();
          server.on('crash', async () => {
            try {
              const crashTime = new Date();
              if (cleaning) {
                throw new Error('tdd process exiting...');
              } else if (crashTime - startTime < 5000) {
                buildLog('Process crashed immediately upon startup, press enter to restart...');
                process.stdin.once('data', async () => server.restart());
              } else if (pauseOnCrash) {
                buildLog('Process crashed, press enter to restart...');
                process.stdin.once('data', async () => server.restart());
              } else {
                buildLog('Process crashed, restarting');
                setTimeout(async () => server.restart(), 500);
              }
            } catch (err) {
              buildLog(`Failed to restart from crash: ${err.message}`);
            }
          });
          server.on('restart', () => {
            startTime = new Date();
          });
        } else {
          await server?.restart();
        }
      });
    }
  } catch (err) {
    buildLog(`Something in tdd threw an exception: ${err.toString()}`);
    console.error(err);
  } finally {
    await cleanupAndExit();
  }
}
