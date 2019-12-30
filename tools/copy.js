import { buildLog, getPkg, getVersion, writeFile, copyDir, copyFile, cleanDir } from 'build-strap';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs-extra';

/**
 * Copies everything to the build folder that we want to publish
 */
export default async function copy() {
  if (process.argv.includes('--no-copy')) {
    buildLog('Skipping due to --no-copy');
    return;
  }

  await fs.ensureDir('build');
  const version = await getVersion();
  const pkg = getPkg();
  await Promise.all([
    copyDir('./config/', './build/config', '**/!(local)*'),
    copyDir('./public/', './build/public'),
    copyFile('./yarn.lock', './build/yarn.lock'),
    writeFile(
      './build/package.json',
      JSON.stringify(
        {
          name: pkg.name,
          version: version.npm,
          license: 'UNLICENSED',
          private: true, // prevents npm publish
          dependencies: pkg.dependencies || [],
          peerDependencies: pkg.peerDependencies || [],
          engines: pkg.engines || [],
          scripts: {
            start: 'node server.js',
          },
        },
        null,
        2,
      ),
    ),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch(['public/**/*'], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const start = new Date();
      const src = path.relative('./', filePath);
      const dist = path.join('build/', src.startsWith('src') ? path.relative('src', src) : src);
      switch (event) {
        case 'add':
        case 'change':
          await fs.ensureDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      const end = new Date();
      const time = end.getTime() - start.getTime();
      buildLog(`${event} '${dist}' after ${time} ms`);
    });
  }
}
