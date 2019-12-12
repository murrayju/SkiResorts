import run from './run';
import tdd from './tdd';

// Use docker-compose to run tdd in a docker container
export default async function dockerTdd(
  pauseOnCrash = process.argv.includes('--tdd-pause-on-crash'),
  testIntegration = process.argv.includes('--test-integration'),
  testDebug = process.argv.includes('--test-debug'),
  debugBreak = process.argv.includes('--break'),
) {
  await run(
    tdd,
    pauseOnCrash,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    true,
    testIntegration,
    testDebug,
    debugBreak,
  );
}
