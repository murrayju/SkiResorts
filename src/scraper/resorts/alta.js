// @flow
import { isNaN } from 'lodash';
import moment from 'moment-timezone';
import { VM } from 'vm2';

import type { ResortScraper } from '../scraper';

const maybeFloat = (str: mixed): ?number => {
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
};

const tz = 'America/Denver';

const sandbox = {
  window: {},
};
const vm = new VM({ sandbox });

const alta: ResortScraper = [
  {
    url: 'https://www.alta.com/weather',
    customFn: async ($, url) => {
      const script = $('script')
        .map((i, s) => s.childNodes[0]?.data)
        .filter((i, s) => /^window.Alta\s=/.test(s))
        .get(0);
      vm.run(script);
      const rawData = sandbox.window.Alta;
      if (!rawData) {
        console.error(`Failed to scrape js data from ${url}`);
        return {};
      }
      const { conditions } = rawData;
      const conditionsDate = conditions.dated_at
        ? moment.tz(conditions.dated_at, 'YYYY-MM-DD HH:mm:ss', tz).toISOString()
        : undefined;
      return {
        rawData,
        weather: {
          summary_lastUpdated: conditionsDate,
          base_lastUpdated: conditionsDate,
          mid_lastUpdated: conditionsDate,
          top_lastUpdated: conditionsDate,
          summary_12hrSnowInches: maybeFloat(conditions.last12),
          summary_24hrSnowInches: maybeFloat(conditions.last24),
          summary_baseDepthInches: maybeFloat(conditions.base_depth),
          summary_stormTotalInches: maybeFloat(conditions.storm_total),
          summary_seasonTotalInches: maybeFloat(conditions.year_to_date),
          base_tempF: maybeFloat(conditions.base_temp),
          mid_tempF: maybeFloat(conditions.mid_temp),
          top_tempF: maybeFloat(conditions.top_temp),
          summary_windDirection: maybeFloat(conditions.wind_direction),
          summary_windSpeedMph: maybeFloat(conditions.wind_speed),
          summary_skyCover: conditions.sky_cover,
        },
      };
    },
  },
  {
    url: 'https://www.alta.com/lift-terrain-status',
    customFn: async ($, url) => {
      const script = $('script')
        .map((i, s) => s.childNodes[0]?.data)
        .filter((i, s) => /^window.Alta\s=/.test(s))
        .get(0);
      vm.run(script);
      const rawData = sandbox.window.Alta;
      if (!rawData) {
        console.error(`Failed to scrape js data from ${url}`);
        return {};
      }
      const {
        liftStatus: { lifts, terrainAreas: areas, accessGates: gates },
      } = rawData;
      return {
        rawData,
        status: {
          lifts_open: lifts.filter(l => l.open).map(l => l.name),
          lifts_closed: lifts.filter(l => !l.open).map(l => l.name),
          runs_open: lifts.flatMap(l => l.runs.filter(r => r.open).map(r => r.name)),
          runs_closed: lifts.flatMap(l => l.runs.filter(r => !r.open).map(r => r.name)),
          areas_open: [
            ...areas.filter(a => a.status === 'open').map(a => a.name),
            ...gates.filter(g => g.open).map(g => g.name),
          ],
          areas_closed: [
            ...areas.filter(a => a.status === 'closed').map(a => a.name),
            ...gates.filter(g => !g.open).map(g => g.name),
          ],
          areas_pending: areas.filter(a => !['open', 'closed'].includes(a.status)).map(a => a.name),
        },
      };
    },
  },
];

export default alta;
