/* eslint-disable global-require, import/no-dynamic-require */
import chokidar from 'chokidar';
import path from 'path';
import debounce from 'lodash/debounce';
import Queue from 'promise-queue';
import { buildLog, clean, onKillSignal, run } from 'build-strap';

import babelTransform from './babel';
import cleanBuild from './cleanBuild';
import cleanDeps from './cleanDeps';
import copy from './copy';
import lint from './lint';
import flow from './flow';
import deps from './deps';
import yarn, { yarnFiles } from './yarn';
import generateSrc from './generateSrc';

/**
 * Transforms source into production ready code/binary
 */
export default async function build(watch = process.argv.includes('--watch'), doLint = true, doFlow = true, cbFn) {
  const noBuild = process.argv.includes('--no-build') || process.argv.includes('--build-once');
  if (process.argv.includes('--no-initial-build')) {
    buildLog('Skipping due to --no-initial-build');
    // Still need to copy the config (for docker tdd)
    await run(copy);
  } else if (noBuild && !process.argv.includes('--build-once')) {
    buildLog('Skipping due to --no-build');
    // Still need to copy the config (for docker tdd)
    await run(copy);
  } else {
    // full initial build
    await run(cleanBuild);

    // pre-build
    if (process.argv.includes('--cleanDeps')) {
      await run(cleanDeps);
    }
    await run(deps);
    if (doLint) {
      await run(lint);
    }
    if (doFlow) {
      await run(flow);
    }
    await run(generateSrc);

    // actual build
    await Promise.all([run(copy), run(babelTransform)]);
  }

  // callback for a complete, successful build
  if (cbFn) await cbFn();

  // Watch mode, for tdd
  if (watch) {
    buildLog('Initial build complete, watching source for changes...');
    const queue = new Queue(1);

    const createWatcher = (paths, action) => {
      const watcher = chokidar.watch(paths, {
        ignoreInitial: true,
        ignored: /.*\._generated_\..*/,
        usePolling: process.argv.includes('--poll-fs'),
      });

      watcher.on(
        'all',
        debounce(async (event, filePath) => {
          const src = path.relative('./', filePath);
          const willQueue = queue.getPendingLength() > 0;
          buildLog(`Detected ${event} to '${src}', ${willQueue ? 'queuing' : 'executing'} action`);
          const queueStart = new Date();
          await queue.add(async () => {
            const queueEnd = new Date();
            const queueTime = queueEnd.getTime() - queueStart.getTime();
            if (willQueue) {
              buildLog(
                `Executing dequeued action for: detected ${event} to '${src}'\n  (waited ${queueTime} ms in queue)`,
              );
            }
            const start = new Date();
            await action(src);
            const end = new Date();
            const time = end.getTime() - start.getTime();
            buildLog(
              `Processed ${event} to '${src}' in ${time} ms${willQueue ? ` (after ${queueTime} ms in queue)` : ''}`,
              end,
            );
            if (cbFn && queue.getQueueLength() === 0) {
              // Don't call back until the queue is empty
              await cbFn();
            }
          });
        }, 500),
      );

      return watcher;
    };

    const doBabel = async () => {
      await clean(['./build/src/**']);
      await Promise.all([run(babelTransform), ...(doLint ? [run(lint)] : []), ...(doFlow ? [run(flow)] : [])]);
    };
    const babelWatcher = createWatcher(['./src/**/*'], async () =>
      noBuild ? buildLog('Skipping babel due to --no-build') : doBabel(),
    );

    const configWatcher = createWatcher(['./config/*.yml', './config.dev/*.yml'], async () => {
      await clean(['./build/config/**']);
      await run(copy);
    });

    const yarnWatcher = createWatcher(yarnFiles, async () => {
      await run(yarn);
      await run(generateSrc);
      await doBabel();
    });

    await new Promise((resolve, reject) => {
      onKillSignal(() => {
        babelWatcher.close();
        configWatcher.close();
        yarnWatcher.close();
        reject(new Error('Aborted by signal'));
      });
    });
  }
}
