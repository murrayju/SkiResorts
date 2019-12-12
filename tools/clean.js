import { run, buildLog } from 'build-strap';
import cleanBuild from './cleanBuild';
import cleanDeps from './cleanDeps';

export default async function clean() {
  if (process.argv.includes('--no-clean')) {
    buildLog('Skipping due to --no-clean');
    return;
  }
  await run(cleanBuild);
  await run(cleanDeps);
}
