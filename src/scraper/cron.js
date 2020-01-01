// @flow
import config from '@murrayju/config';
import { CronJob } from 'cron';
import { getResortsData } from './scraper';
import resorts from './resorts';
import logger from '../logger';
import { entries } from '../util/maps';
import type { ServerContext } from '../server';

export const createScraperCron = ({ db, emitter }: ServerContext) => {
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
                const newData = {
                  resort,
                  name,
                  status,
                  timestamp,
                };
                await db.collection(type).insertOne(newData);
                emitter.emit('NEW_RESORT_DATA', type, newData);
              }),
            );
          }),
        );

        if (Object.keys(resortData.weather).length) {
          const newData = {
            ...resortData.weather,
            resort,
            timestamp,
          };
          await db.collection('weather').insertOne(newData);
          emitter.emit('NEW_WEATHER_DATA', newData);
        }
      }),
    );
  };

  return new CronJob(config.get('scraper.cron.interval'), recordData, null, true);
};
