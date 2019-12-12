import { run, buildLog } from 'build-strap';
import cleanDownloads from './cleanDownloads';
import cleanYarn from './cleanYarn';

// Delete downloaded dependencies
export default async function cleanDeps() {
  if (process.argv.includes('--no-cleanDeps')) {
    buildLog('Skipping due to --no-cleanDeps');
    return;
  }
  await run(cleanDownloads);
  await run(cleanYarn);
}
