import bundle from './bundle';
import clean from './clean';
import copy from './copy';
import generateSrc from './generateSrc';
import lint from './lint';
import run from './run';
import yarn from './yarn';

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
