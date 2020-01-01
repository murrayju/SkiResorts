import { run, buildLog } from 'build-strap';
import eslint from './eslint';
import flow from './flow';

// Lint the source using eslint
export default async function lint() {
  if (process.argv.includes('--no-lint')) {
    buildLog('Skipping due to --no-lint');
    return;
  }
  await run(eslint);
  await run(flow);
}
