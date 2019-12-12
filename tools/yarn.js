import md5File from 'md5-file/promise';
import fs from 'fs-extra';
import { run, yarn, buildLog, readDir } from 'build-strap';
import cleanYarn from './cleanYarn';

export const yarnFiles = ['./package.json', './yarn.lock'];

// Download javascript dependencies (using yarn)
export default async function yarnInstall(clean = process.argv.includes('--clean-yarn')) {
  if (clean) {
    await run(cleanYarn);
  }
  if (process.argv.includes('--no-yarn')) {
    buildLog('Skipping due to --no-yarn');
    return;
  }
  await fs.ensureDir('./node_modules');
  const currentHash = (await Promise.all(yarnFiles.map(async f => md5File(f)))).join('|');
  const buildHashFile = './download/buildhash_yarn.md5';
  await fs.ensureFile(buildHashFile);
  const prevHash = await fs.readFile(buildHashFile, 'utf8');
  if (currentHash !== prevHash) {
    buildLog('node package definition changed since last build, invoking yarn.');
  } else if (!(await readDir('./node_modules/**/*.js')).length) {
    buildLog('node packages missing, invoking yarn.');
  } else if (process.argv.includes('--force-yarn')) {
    buildLog('node packages unchanged, but yarn forced on command line...');
  } else {
    buildLog('node packages unchanged since last build, skipping yarn.');
    return;
  }
  await yarn();
  await fs.writeFile(buildHashFile, currentHash);
}
