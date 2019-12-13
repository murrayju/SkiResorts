// @flow
import fs from 'fs-extra';
import { dockerImages, dockerRmi, getUntaggedDockerIds, getDockerTags } from 'build-strap';
import type { DockerImage, DockerImageFilter } from 'build-strap';
import { getBuildImage, getBuilderImage, getBuilderRepo } from './docker';

export default async function dockerCleanup(
  purgeAll: boolean = process.argv.includes('--purge-all'),
  purgeOld: boolean = process.argv.includes('--purge-old'),
) {
  const files = [
    './latest.builder.tag',
    './latest.builder.id',
    './latest.build.tag',
    './latest.build.id',
  ];
  await Promise.all(files.map(async f => fs.ensureFile(f)));
  const builderTag = (await fs.readFile('./latest.builder.tag')).toString();
  const builderId = (await fs.readFile('./latest.builder.id')).toString();
  const buildTag = (await fs.readFile('./latest.build.tag')).toString();
  const buildId = (await fs.readFile('./latest.build.id')).toString();

  // We only match images without a latest* tag, and more than an hour old
  const filterLatest: DockerImageFilter = (m: DockerImage) =>
    purgeAll || !m.tag.match(/^latest(-\w+)?$/);
  const filterOld: DockerImageFilter = (m: DockerImage) =>
    purgeAll || (filterLatest(m) && m.created < Date.now() - 1000 * 60 * 60);

  await dockerRmi([
    // unique tags for this build
    ...(builderTag ? [await getBuilderImage(builderTag)] : []),
    ...(buildTag ? [await getBuildImage(buildTag)] : []),

    // all other tags for this image (except latest-build)
    ...(builderId ? await getDockerTags(builderId, getBuilderRepo(), true, filterLatest) : []),
    ...(buildId ? await getDockerTags(buildId, undefined, true, filterLatest) : []),

    // images in this repo without a tag
    ...(await getUntaggedDockerIds(undefined, filterOld)),
    ...(await getUntaggedDockerIds(getBuilderRepo(), filterOld)),

    // images with no repo and no tag
    ...(
      await dockerImages(null, m => m.repository === '<none>' && m.tag === '<none>' && filterOld(m))
    ).map(m => m.id),

    // any leftover tags from prior builds (only if purgeAll or purgeOld)
    ...(purgeAll || purgeOld
      ? [
          ...(await getDockerTags(null, undefined, true, filterOld)),
          ...(await getDockerTags(null, getBuilderRepo(), true, filterOld)),
        ]
      : []),
  ]);
  await Promise.all(files.map(async f => fs.remove(f)));
}
