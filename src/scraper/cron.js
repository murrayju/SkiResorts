// @flow
import config from '@murrayju/config';
import { CronJob } from 'cron';
import type { Db } from 'mongodb';
import { getResortsData } from './scraper';
import resorts from './resorts';
import logger from '../logger';
import { entries } from '../util/maps';

export const createScraperCron = (db: Db) => {
  const recordData = async () => {
    if (!config.get('scraper.enabled')) {
      logger.debug('scraper disabled, skipping');
      return;
    }
    const rawData = await getResortsData(resorts);
    logger.debug('Fetched raw data' /* , { rawData } */);

    const timestamp = new Date();

    // $FlowFixMe
    await Promise.allSettled(
      entries(rawData).map(async ([resort, resortData]) => {
        // $FlowFixMe
        await Promise.allSettled(
          entries(resortData.status).map(async ([comboName, values]) => {
            const [type, status] = comboName.split('_');
            // $FlowFixMe
            await Promise.allSettled(
              values.map(async name => {
                await db.collection(type).insertOne({
                  resort,
                  name,
                  status,
                  timestamp,
                });
              }),
            );
          }),
        );

        if (Object.keys(resortData.weather).length) {
          await db.collection('weather').insertOne({
            ...resortData.weather,
            resort,
            timestamp,
          });
        }
      }),
    );
  };

  return new CronJob(config.get('scraper.cron.interval'), recordData, null, true);
};
