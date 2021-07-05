import { buildLog, dockerComposeTeardown, onKillSignal, run, spawn } from 'build-strap';
import fs from 'fs-extra';
import getPort from 'get-port';
import path from 'path';

import build from './build';

// Run tests in Mocha
export default async function test(
  testOnly = process.argv.includes('--test-only'),
  ignoreFailures = process.argv.includes('--ignore-test-failures'),
  integration = process.argv.includes('--test-integration'),
  extraEnv = null,
  testDebug = process.argv.includes('--test-debug'),
  dockerizeDeps = !process.argv.includes('--test-no-dockerize-deps'),
) {
  if (process.argv.includes('--no-test')) {
    buildLog('Skipping due to --no-test');
    return;
  }
  if (!testOnly) {
    await run(build, false);
  } else {
    await fs.remove('./build/node_modules');
  }

  if (integration && dockerizeDeps) {
    onKillSignal(() => dockerComposeTeardown());
  }
  try {
    await spawn(
      'mocha',
      [
        '--exit',
        `--inspect${testDebug ? '-brk' : ''}=0.0.0.0:${await getPort({
          host: '0.0.0.0',
          port: 9222,
        })}`,
        '"./build/**/*.test.js"',
      ],
      {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: 'test',
          TEST_INTEGRATION: integration,
          LD_LIBRARY_PATH: path.resolve('./build/lib'),
          ...extraEnv,
        },
      },
    );
  } catch (err) {
    const sigint = err.message.match(/130 \(error\)/);
    if (sigint) {
      buildLog('Tests interrupted by SIGINT');
    }
    const sigterm = err.message.match(/143 \(error\)/);
    if (sigterm) {
      buildLog('Tests interrupted by SIGTERM');
    }
    if (integration && dockerizeDeps) {
      await dockerComposeTeardown();
    }
    if (!ignoreFailures || sigint || sigterm) {
      throw err;
    }
  }
  if (integration && dockerizeDeps) {
    await dockerComposeTeardown();
  }
}
