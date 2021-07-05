// @flow
import { buildLog, run, yarnInstall } from 'build-strap';

import cleanYarn from './cleanYarn';

// Download javascript dependencies (using yarn)
export default async function yarn(clean: boolean = process.argv.includes('--yarn-clean')) {
  if (process.argv.includes('--yarn-skip')) {
    buildLog('Skipping due to --yarn-skip');
    return;
  }
  if (clean) {
    await run(cleanYarn);
  }
  await yarnInstall();
}
