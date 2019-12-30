import { run, clean, publish, getVersion, buildLog, yarn } from 'build-strap';
import build from './build';
// import test from './test';

export default async function doPublish() {
  if (process.argv.includes('--no-publish')) {
    buildLog('Skipping due to --no-publish');
    return;
  }
  if (process.argv.includes('--watch')) {
    buildLog('`--watch` option is not compatible with publish.');
    return;
  }
  const version = await getVersion();

  let publishToGithub = process.argv.includes('--force-publish');
  if (!publishToGithub && process.argv.includes('--publish')) {
    if (parseInt(version.build, 10) === 0) {
      buildLog(
        'Ignoring --publish for dev build (build number is 0). Use --force-publish to override.',
      );
    } else {
      publishToGithub = true;
    }
  }

  if (!process.argv.includes('--publish-only')) {
    await run(build);
    // await run(test, true);
    if (process.argv.includes('--publish-node-modules')) {
      buildLog('Fetching node_modules needed for production...');
      await yarn([], {
        cwd: './build/',
      });
    }
  }
  await clean(['./out/**']);
  await run(publish, './build', './out', publishToGithub);
}
