// @flow
import { buildLog, yarnUpgrade } from 'build-strap';

// run yarn upgrade
export default async function upgrade(outdated: boolean = process.argv.includes('--outdated')) {
  if (process.argv.includes('--no-upgrade')) {
    buildLog('Skipping due to --no-upgrade');
    return;
  }
  await yarnUpgrade({ outdated });
}
