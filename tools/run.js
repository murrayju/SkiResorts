import { run, runCli, setPkg, buildLog } from 'build-strap';
import pkg from '../package.json';

setPkg(pkg);

// Command line entrypoint
if (require.main === module) {
  delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle
  // eslint-disable-next-line global-require, import/no-dynamic-require
  runCli(path => require(`./${path}`).default, 'publish')
    .then(() => process.exit(0))
    .catch(err => {
      buildLog(`Unhandled exception in run module: ${err}`);
      process.exit(-1);
    });
}

export default run;
