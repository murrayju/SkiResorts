import nodemon from 'nodemon';
import path from 'path';
import { run, onKillSignal } from 'build-strap';
import getPort from 'get-port';
import build from './build';

let spawned = false;

/**
 * Development mode. When files change, rebuild, test, and run
 */
export default async function serve(
  dev = process.argv.includes('--dev'),
  debugBreak = process.argv.includes('--break'),
  appArgs = [...process.argv.slice(3)],
  standalone = true,
  extraEnv = null,
) {
  if (!spawned) {
    if (standalone) {
      await run(build, false);
    }
    const nodeArgs = [];
    if (dev) {
      nodeArgs.push(
        `--inspect${debugBreak ? '-brk' : ''}=0.0.0.0:${await getPort({
          host: '0.0.0.0',
          port: 9229,
        })}`,
      );
      appArgs.push('--dev');
    }
    const nodemonKillSignal = 'SIGUSR1';
    nodemon({
      script: './build/src/main.js',
      nodeArgs,
      args: appArgs,
      watch: false,
      stdin: false,
      signal: nodemonKillSignal,
      env: {
        ...process.env,
        NODE_ENV: dev ? 'development' : 'production',
        LD_LIBRARY_PATH: path.resolve('./build/lib'),
        NODEMON_KILL_SIG: nodemonKillSignal,
        ...extraEnv,
      },
    });
    spawned = true;
    if (standalone) {
      // block the process, wait for kill signal
      await new Promise((resolve, reject) => {
        onKillSignal(() => {
          nodemon.emit('quit');
          process.exit();
          reject(new Error('Aborted by signal'));
        });
        nodemon.on('exit', resolve);
        nodemon.on('crash', reject);
      });
    }
  } else {
    nodemon.emit('restart');
  }

  return {
    restart: async () =>
      new Promise((resolve, reject) => {
        nodemon.once('restart', resolve);
        nodemon.once('crash', reject);
        nodemon.emit('restart');
      }),
    kill: () => nodemon.emit('quit'),
    on: (...args) => nodemon.on(...args),
  };
}
