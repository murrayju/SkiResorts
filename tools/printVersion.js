import { getVersion } from 'build-strap';

// Prints out the project version to the console
export default async function printVersion() {
  console.info((await getVersion()).info);
}
