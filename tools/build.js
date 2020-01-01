import run from './run';
import clean from './clean';
import copy from './copy';
import bundle from './bundle';
import lint from './lint';
import yarn from './yarn';
import generateSrc from './generateSrc';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build(cleanDeps = process.argv.includes('--clean-deps')) {
  await run(clean, cleanDeps);
  await run(yarn);
  await run(lint);
  await run(copy);
  await run(generateSrc);
  await run(bundle);
}

export default build;
