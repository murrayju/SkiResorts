// @flow
import { isNaN } from 'lodash';
import moment from 'moment-timezone';

import type { ResortScraper } from '../scraper';

const findInHTable = (tableSelector: string, heading: RegExp, col?: number = 0) => ($): string =>
  $(`${tableSelector} tr`)
    .filter((i, item) =>
      heading.test(
        $(item)
          .children('th')
          .text(),
      ),
    )
    .map((i, item) =>
      $(item)
        .children('td')
        .eq(col)
        .text()
        .trim(),
    )
    .get()[0];

const findNumberInHTable = (tableSelector: string, heading: RegExp, col?: number = 0) => (
  $,
): ?number => {
  const num = parseFloat(findInHTable(tableSelector, heading, col)($));
  return isNaN(num) ? undefined : num;
};

const findInTable = (tableSelector: string, col?: number = 0, row?: number = 0) => ($): string =>
  $(`${tableSelector} > tbody > tr`)
    .eq(row)
    .children('td')
    .eq(col)
    .text()
    .trim();

const findNumberInTable = (tableSelector: string, col?: number = 0, row?: number = 0) => (
  $,
): ?number => {
  const num = parseFloat(findInTable(tableSelector, col, row)($));
  return isNaN(num) ? undefined : num;
};

const weatherObservationsTable = 'main .content-wrap .container table.table';
const weatherObservationDate = (row?: number = 0) => $ =>
  moment
    .tz(
      `${findInTable(weatherObservationsTable, 0, row)($)} ${findInTable(
        weatherObservationsTable,
        1,
        row,
      )($)} ${findInTable(weatherObservationsTable, 2, row)($)}`,
      'MMMM DD h a',
      'America/Denver',
    )
    .toISOString();

const alta: ResortScraper = [
  {
    url: 'https://www.alta.com/conditions/daily-mountain-report/snow-report',
    statusSelectors: {
      lifts_open: $ =>
        $('#lift-status ~ .table-weather td:has(.fa-open)')
          .map(
            (i, item) =>
              $(item)
                .prev()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get()
          .filter(item => item !== 'OPEN'),
      lifts_closed: $ =>
        $('#lift-status ~ .table-weather td:has(.fa-closed)')
          .map(
            (i, item) =>
              $(item)
                .prev()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get()
          .filter(item => item !== 'CLOSED'),
      areas_open: $ =>
        $('#expected-openings ~ .table-weather td:has(.open-status-open)')
          .map((i, item) =>
            $(item)
              .prev()
              .text(),
          )
          .get()
          .filter(item => item !== 'OPEN'),
      areas_closed: $ =>
        $('#expected-openings ~ .table-weather td:has(.open-status-closed)')
          .map((i, item) =>
            $(item)
              .prev()
              .text(),
          )
          .get()
          .filter(item => item !== 'CLOSED'),
    },
    weatherSelectors: {
      summary_lastUpdated: $ => {
        const [, day, time] =
          $('#snow-fall ~ p')
            .first()
            .text()
            .match(/last updated (\w+) at ([^,]+),/i) || [];
        if (day && time) {
          const ts = moment.tz(time, 'h:mmA', 'America/Denver');
          if (day === 'yesterday') {
            ts.subtract(1, 'day');
          }
          return ts;
        }
        return undefined;
      },
      summary_snowSince4amInches: findNumberInHTable(
        '#snow-fall ~ .table-weather',
        /since 4am today/i,
      ),
      summary_snowSince4pmYesterdayInches: findNumberInHTable(
        '#snow-fall ~ .table-weather',
        /since 4pm yesterday/i,
      ),
      summary_stormTotalInches: findNumberInHTable('#snow-fall ~ .table-weather', /storm total/i),
      summary_seasonTotalInches: findNumberInHTable('#snow-fall ~ .table-weather', /season total/i),
      summary_baseDepthInches: findNumberInHTable(
        '#snow-fall ~ .table-weather',
        /mid mountain depth/i,
      ),
      summary_tempF: findNumberInHTable(
        '#current-conditions ~ .table-weather',
        /mid mountain temp/i,
      ),
      summary_skyCover: findInHTable('#current-conditions ~ .table-weather', /sky cover/i, 1),
      summary_windSpeed: findInHTable('#current-conditions ~ .table-weather', /ridgetop winds/i),
      summary_windDirection: findInHTable(
        '#current-conditions ~ .table-weather',
        /ridgetop winds/i,
        1,
      ),
    },
  },
  {
    url: 'https://www.alta.com/conditions/weather-observations/base-observations',
    weatherSelectors: {
      base_lastUpdated: weatherObservationDate(),
      base_tempF: findNumberInTable(weatherObservationsTable, 3),
      base_windDirection: findNumberInTable(weatherObservationsTable, 4),
      base_windSpeedMph: findNumberInTable(weatherObservationsTable, 5),
      base_windGustMph: findNumberInTable(weatherObservationsTable, 6),
      base_hourlyWaterInches: findNumberInTable(weatherObservationsTable, 7),
      base_waterSince4amInches: findNumberInTable(weatherObservationsTable, 8),
    },
  },
  {
    url: 'https://www.alta.com/conditions/weather-observations/collins-observations',
    weatherSelectors: {
      mid_lastUpdated: weatherObservationDate(),
      mid_tempF: findNumberInTable(weatherObservationsTable, 3),
      mid_12hrSnowInches: findNumberInTable(weatherObservationsTable, 4),
      mid_baseDepthInches: findNumberInTable(weatherObservationsTable, 5),
      mid_hourlySnowInches: findNumberInTable(weatherObservationsTable, 6),
      mid_snowSince4amInches: findNumberInTable(weatherObservationsTable, 7),
    },
  },
  {
    url: 'https://www.alta.com/conditions/weather-observations/top-of-collins-observations',
    weatherSelectors: {
      top_lastUpdated: weatherObservationDate(),
      top_tempF: findNumberInTable(weatherObservationsTable, 3),
      top_humidity: findNumberInTable(weatherObservationsTable, 4),
      top_windDirection: findNumberInTable(weatherObservationsTable, 5),
      top_windSpeedMph: findNumberInTable(weatherObservationsTable, 6),
      top_windGustMph: findNumberInTable(weatherObservationsTable, 7),
    },
  },
];

export default alta;
