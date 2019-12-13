import fs from 'fs-extra';
import { getDockerDigest, getDockerTags, dockerLogin, dockerPush } from 'build-strap';

// Push docker image to docker repo
export default async function doDockerPush() {
  await dockerLogin();
  const file = './latest.build.id';
  await fs.ensureFile(file);
  const buildId = (await fs.readFile(file)).toString();
  await dockerPush(
    (await getDockerTags(buildId)).filter(t => t.match(/^(?:latest.*|[0-9]+(?:\.[0-9]+)*)$/)),
  );
  await fs.writeFile('./latest.build.digest', await getDockerDigest(buildId));
}
