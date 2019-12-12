import { makeDir, spawn, buildLog } from 'build-strap';

// Transpile js using babel
export default async function babel() {
  if (process.argv.includes('--no-babel')) {
    buildLog('Skipping due to --no-babel');
    return;
  }
  await makeDir('./build/src');
  await spawn('babel', ['src', '-d', 'build/src'], {
    stdio: 'inherit',
    shell: true,
  });
}
