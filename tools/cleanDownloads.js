import { clean, buildLog } from 'build-strap';

export default async function cleanDownloads() {
  if (process.argv.includes('--no-clean-downloads')) {
    buildLog('Skipping due to --no-clean-downloads');
    return;
  }
  await clean(['./download/!(node*|yarn*)']);
}
