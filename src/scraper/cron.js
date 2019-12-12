import config from '@murrayju/config';
import { CronJob } from 'cron';
import { getResortsData } from './scraper';
import resorts from './resorts';
import logger from '../logger';

export const createScraperCron = db => {
  const recordData = async () => {
    const rawData = await getResortsData(resorts);
    logger.debug('Fetched raw data', { rawData });

    const timestamp = new Date();

    await Promise.allSettled(
      Object.entries(rawData).map(async ([resort, resortData]) => {
        await Promise.allSettled(
          Object.entries(resortData).map(async ([comboName, values]) => {
            const [type, status] = comboName.split('_');
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
      }),
    );
  };

  return new CronJob(config.get('scraper.cron.interval'), recordData, null, true);
};
