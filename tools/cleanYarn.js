import { clean, buildLog } from 'build-strap';

export default async function cleanYarn() {
  if (process.argv.includes('--no-clean-yarn')) {
    buildLog('Skipping due to --no-clean-yarn');
    return;
  }
  await clean(['./node_modules']);
}
