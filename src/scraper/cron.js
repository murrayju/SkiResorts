import config from '@murrayju/config';
import { CronJob } from 'cron';
import { getResortsData } from './scraper';
import resorts from './resorts';
import logger from '../logger';

export const createScraperCron = db => {
  const recordData = async () => {
    const rawData = await getResortsData(resorts);
    logger.debug('Fetched raw data', { rawData });
  };

  return new CronJob(config.get('scraper.cron.interval'), recordData, null, true);
};
