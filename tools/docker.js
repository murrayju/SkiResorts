// @flow
import fs from 'fs-extra';
import {
  buildLog,
  dockerBuild,
  dockerComposeRunService,
  dockerImages,
  dockerTagVersion,
  getDockerId,
  getDockerRepo,
  getUniqueBuildTag,
  getVersion,
  type DockerContainerInfo,
} from 'build-strap';

export async function getBuilderTag(): Promise<string> {
  return `builder-${await getUniqueBuildTag()}`;
}

export async function getBuildTag(): Promise<string> {
  return `build-${await getUniqueBuildTag()}`;
}

export function getBuilderRepo(): string {
  return `${getDockerRepo()}_builder`;
}

export async function getBuildImage(tag: ?string): Promise<string> {
  return `${getDockerRepo()}:${tag || (await getBuildTag())}`;
}

export async function getBuilderImage(tag: ?string): Promise<string> {
  return `${getBuilderRepo()}:${tag || (await getBuilderTag())}`;
}

// Build the project using docker
export default async function docker(
  builderOnly: boolean = process.argv.includes('--docker-builder-only'),
) {
  if (process.argv.includes('--no-docker')) {
    buildLog('Skipping due to --no-docker');
    return;
  }

  // ensure that these files exist, so that we can guarantee to stash them
  await Promise.all(
    [
      './latest.builder.tag',
      './latest.builder.id',
      './latest.build.tag',
      './latest.build.id',
    ].map(async f => fs.ensureFile(f)),
  );

  const v = await getVersion();
  const builderRepo = getBuilderRepo();
  const builderTag = await getBuilderTag();
  const buildTag = await getBuildTag();
  await Promise.all([
    fs.writeFile('./latest.builder.tag', builderTag),
    fs.writeFile('./latest.build.tag', buildTag),
  ]);

  // First build the builder image
  await dockerBuild(
    ['latest-build', builderTag],
    [`BUILD_NUMBER=${v.build}`],
    'builder',
    null,
    builderRepo,
  );
  const builderId = await getDockerId(builderTag, builderRepo);
  await fs.writeFile('./latest.builder.id', builderId);
  buildLog(`Successfully built builder docker image: ${builderId}`);
  if (builderOnly) return;

  // Then build the production image
  await dockerBuild(['latest-build', buildTag], [`BUILD_NUMBER=${v.build}`], 'production');
  const buildId = await getDockerId(buildTag);
  await fs.writeFile('./latest.build.id', buildId);

  await dockerTagVersion(buildId);

  buildLog(`Successfully built production docker image: ${buildId}`);
}

export async function ensureBuilder(
  build: boolean = process.argv.includes('--build-docker'),
): Promise<string> {
  await fs.ensureFile('./latest.builder.tag');
  const tag = await getBuilderTag();
  if (build || !(await dockerImages(getBuilderRepo())).find(m => m.tag === tag)) {
    buildLog('Image does not exist, running docker build...');
    await docker(true);
  }
  return tag;
}

export const runDbContainer = async (useExisting?: boolean = true): Promise<DockerContainerInfo> =>
  dockerComposeRunService('db', { avoidConflicts: !useExisting });
