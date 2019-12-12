import { run, buildLog } from 'build-strap';
import cleanDeps from './cleanDeps';
import yarn from './yarn';

// Download all external dependencies
export default async function deps(clean = process.argv.includes('--clean-deps')) {
  if (clean) {
    await run(cleanDeps);
  }
  if (process.argv.includes('--no-deps')) {
    buildLog('Skipping due to --no-deps');
    return;
  }

  await run(yarn);
}
