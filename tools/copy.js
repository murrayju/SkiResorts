import { buildLog, getPkg, getVersion, writeFile, copyDir, copyFile } from 'build-strap';

/**
 * Copies everything to the build folder that we want to publish
 */
export default async function copy() {
  if (process.argv.includes('--no-copy')) {
    buildLog('Skipping due to --no-copy');
    return;
  }

  await copyDir('./src/data/', './build/data');
  await copyDir('./config/', './build/config', '**/!(local)*');
  await copyFile('./yarn.lock', './build/yarn.lock');
  const version = await getVersion();
  const pkg = getPkg();
  await writeFile(
    './build/package.json',
    JSON.stringify(
      {
        name: pkg.name,
        version: version.npm,
        main: './build/src/main.js',
        license: 'UNLICENSED',
        private: true, // prevents npm publish
        dependencies: pkg.dependencies || [],
        peerDependencies: pkg.peerDependencies || [],
        engines: pkg.engines || [],
        scripts: {
          start: 'node ./build/src/main.js',
        },
      },
      null,
      2,
    ),
  );
}
