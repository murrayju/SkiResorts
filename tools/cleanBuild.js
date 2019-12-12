import { clean, buildLog } from 'build-strap';

export default async function cleanBuild() {
  if (process.argv.includes('--no-clean-build')) {
    buildLog('Skipping due to --no-clean-build');
    return;
  }
  await clean(['./build/**']);
}
