// @flow
import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';
import getPort from 'get-port';
import {
  buildLog,
  getVersion,
  getDockerRepo,
  getDockerId,
  getUniqueBuildTag,
  dockerBuild,
  dockerTag,
  dockerPullAndRunContainer,
  dockerImages,
  dockerNetworkDelete,
  spawn,
} from 'build-strap';
import { entries } from '../src/util/maps';

export async function getBuilderTag() {
  return `builder-${await getUniqueBuildTag()}`;
}

export async function getBuildTag() {
  return `build-${await getUniqueBuildTag()}`;
}

export function getBuilderRepo() {
  return `${getDockerRepo()}_builder`;
}

export async function getBuildImage(tag: ?string) {
  return `${getDockerRepo()}:${tag || (await getBuildTag())}`;
}

export async function getBuilderImage(tag: ?string) {
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

  // determine what tags to apply
  if (v.isRelease) {
    await dockerTag(buildId, [
      'latest',
      `${v.major}`,
      `${v.major}.${v.minor}`,
      `${v.major}.${v.minor}.${v.patch}`,
    ]);
  } else if (v.branch === 'default') {
    await dockerTag(buildId, ['latest-dev']);
  } else if (v.branch.match(/^(release|patch)-/)) {
    await dockerTag(buildId, ['latest-rc']);
  } else if (v.branch.match(/^feature-/)) {
    await dockerTag(buildId, ['latest-feature']);
  }

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

// docker binds to all adapters when mapping ports
const host = '0.0.0.0';

// keep track of docker resources created, to clean up later
export const networks = new Set<string>();
export const containers = [];
let cleaning = null;

export async function dockerTeardown() {
  if (!cleaning) {
    cleaning = (async () => {
      buildLog('Stopping docker containers...');
      const killContainers = Promise.all(
        containers.map(async c => {
          try {
            buildLog(`Stopping container: <${c.alias || c.id}>...`);
            await spawn('docker', ['stop', c.id]);
            buildLog(`container <${c.alias || c.id}> stopped.`);
          } catch (e) {
            buildLog(
              `Failed to stop <${c.alias || c.id}> container: ${e.message}\nForcefully killing...`,
            );
            try {
              await spawn('docker', ['kill', c.id]);
            } catch (err) {
              buildLog(`Failed to kill <${c.alias || c.id}> container: ${err.message}`);
            }
          }
        }),
      );
      containers.length = 0;
      await killContainers;

      buildLog('Deleting docker networks...');
      const killNetworks = Promise.all(
        Array.from(networks).map(async n => {
          try {
            await dockerNetworkDelete(n);
          } catch (err) {
            buildLog(`Failed to delete network '${n}' (probably does not exist): ${err.message}`);
          }
        }),
      );
      networks.clear();
      await killNetworks;
      buildLog('Docker teardown complete!');
    })();
  }
  return cleaning;
}

export async function runDbContainer(
  network: ?string = 'ski-resorts',
  persist: ?string = './db/data',
  port: ?number = 27018,
  alias: ?string = 'db',
) {
  const dc = yaml.safeLoad(await fs.readFile('./docker-compose.yml'));
  const { image, environment } = dc.services.db;
  const p = port && (await getPort({ port, host }));
  buildLog('Starting database server...');
  const dockerPort = 27017;
  const id = await dockerPullAndRunContainer(image, {
    runArgs: [
      ...(persist ? ['-v', `${path.resolve(persist)}:/data/db:rw`] : []),
      ...(p ? ['-p', `${p}:${dockerPort}`] : []),
      ...(alias ? ['--name', `ski-tdd-${alias}`] : []),
      ...(Array.isArray(environment)
        ? environment.reduce((args, env) => [...args, '-e', env], [])
        : entries(environment || {}).reduce((args, [k, v]) => [...args, '-e', `${k}=${v}`], [])),
    ],
    alias,
    network,
  });
  if (network) {
    networks.add(network);
  }
  const url = p && `localhost:${p}`;
  if (url) {
    buildLog(`Database accessible at ${url} (on local machine)`);
  }
  const dockerUrl = alias && network && `${alias}:${dockerPort}`;
  if (dockerUrl && network) {
    buildLog(`Database accessible at ${dockerUrl} (on '${network}' docker network)`);
  }
  const container = {
    alias,
    dockerPort,
    dockerUrl,
    id,
    image,
    port: p,
    url,
  };
  containers.push(container);
  return container;
}
