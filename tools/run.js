import { run, runCli, setPkg } from 'build-strap';
import pkg from '../package.json';

setPkg(pkg);

// Command line entrypoint
if (require.main === module) {
  delete require.cache[__filename]; // eslint-disable-line no-underscore-dangle
  // eslint-disable-next-line global-require, import/no-dynamic-require
  runCli({ resolveFn: path => require(`./${path}`).default, defaultAction: 'publish' });
}

export default run;
