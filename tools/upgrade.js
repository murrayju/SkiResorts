import { yarn, buildLog } from 'build-strap';

// run yarn upgrade
export default async function upgrade() {
  if (process.argv.includes('--no-upgrade')) {
    buildLog('Skipping due to --no-upgrade');
    return;
  }
  await yarn(['upgrade']);
}
