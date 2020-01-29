// @flow
import config from '@murrayju/config';
import { CronJob } from 'cron';
import { merge, isEqual } from 'lodash';
import moment from 'moment';

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
    try {
      const rawResortsData = await getResortsData(resorts);
      logger.debug('Fetched raw data' /* , { rawResortsData } */);

      // $FlowFixMe
      await Promise.allSettled(
        entries(rawResortsData).map(async ([resort, resortData]) => {
          const { timestamp = new Date(), url, rawResponse, rawData } = resortData;
          // record the raw data
          await db.collection('raw').insertOne({ timestamp, url, rawResponse, rawData, resort });

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

          const reshaped = entries(resortData.weather).reduce((obj, [comboName, value]) => {
            if (value == null) {
              // filter out null/undefined values
              return obj;
            }
            const [type, item] = comboName.split('_');
            return merge(obj, {
              [type]: {
                [item]: value,
              },
            });
          }, {});
          // $FlowFixMe
          await Promise.allSettled(
            entries(reshaped).map(async ([location, scrapedData]) => {
              const { lastUpdated: reportedLastUpdatedStr, ...data } = scrapedData;
              const reportedLastUpdated = reportedLastUpdatedStr
                ? moment(reportedLastUpdatedStr)
                : null;

              const [prev] = await db
                .collection('weather')
                .find({ resort, location })
                .sort({ lastUpdated: -1 })
                .limit(1)
                .toArray();

              const dataUnchanged =
                // there is a previous entry
                prev &&
                // there is a reported time
                reportedLastUpdated &&
                // they have the same scraped timestamp
                reportedLastUpdated.isSame(prev.reportedLastUpdated) &&
                // the rest of the scraped data is the same
                isEqual(prev.data, data);

              if (!dataUnchanged) {
                await db.collection('weather').insertOne({
                  resort,
                  location,
                  data,
                  // if reported time is nonsense (in the future), use current time
                  lastUpdated:
                    !reportedLastUpdated || reportedLastUpdated.isAfter(timestamp)
                      ? timestamp
                      : reportedLastUpdated.toDate(),
                  // just so we can see when the scraped dates were nonsense
                  reportedLastUpdated: reportedLastUpdated?.toDate() || null,
                  timestamp,
                });
              }
            }),
          );
        }),
      );
    } catch (err) {
      const { message, stack } = err;
      logger.error('scraper failed', { error: { message, stack } });
    }
  };

  return new CronJob(config.get('scraper.cron.interval'), recordData, null, true);
};
