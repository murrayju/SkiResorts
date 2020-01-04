// @flow
import { isNaN } from 'lodash';
import moment from 'moment-timezone';

import type { ResortScraper } from '../scraper';

const maybeFloat = (str: mixed): ?number => {
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
};

const findInHTable = (tableSelector: string, heading: RegExp, col?: number = 0) => ($): string =>
  $(tableSelector)
    .first()
    .find('tr')
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
): ?number => maybeFloat(findInHTable(tableSelector, heading, col)($));

const findInTable = (tableSelector: string, col?: number = 0, row?: number = 0) => ($): string =>
  $(tableSelector)
    .first()
    .find('> tbody > tr')
    .eq(row)
    .children('td')
    .eq(col)
    .text()
    .trim();

const findNumberInTable = (tableSelector: string, col?: number = 0, row?: number = 0) => (
  $,
): ?number => maybeFloat(findInTable(tableSelector, col, row)($));

const tz = 'America/Denver';
const weatherObservationsTable = 'main .content-wrap .container table.table';
const weatherObservationDate = (row?: number = 0) => $ =>
  moment
    .tz(
      `${moment.tz(tz).year()} ${findInTable(weatherObservationsTable, 0, row)($)} ${findInTable(
        weatherObservationsTable,
        1,
        row,
      )($)} ${findInTable(weatherObservationsTable, 2, row)($)}`,
      'YYYY MMMM DD h a',
      tz,
    )
    .toISOString();

const alta: ResortScraper = [
  {
    url: 'https://www.alta.com/conditions/daily-mountain-report/snow-report',
    statusSelectors: {
      lifts_open: $ =>
        $('#lift-status ~ .table-weather tbody')
          .first()
          .children('tr')
          .filter((i, row) => $(row).has('td .fa-open.fa-check').length)
          .map(
            (i, row) =>
              $(row)
                .children('td')
                .first()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get(),
      lifts_closed: $ =>
        $('#lift-status ~ .table-weather tbody')
          .first()
          .children('tr')
          .filter(
            (i, row) =>
              $(row).has('td .fa-closed.fa-ban').length &&
              !/delayed/i.test(
                $(row)
                  .children('td')
                  .first()
                  .text(),
              ),
          )
          .map(
            (i, row) =>
              $(row)
                .children('td')
                .first()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get(),
      lifts_pending: $ =>
        $('#lift-status ~ .table-weather tbody')
          .first()
          .children('tr')
          .filter(
            (i, row) =>
              $(row).has('td .fa-closed.fa-ban').length &&
              /delayed/i.test(
                $(row)
                  .children('td')
                  .first()
                  .text(),
              ),
          )
          .map(
            (i, row) =>
              $(row)
                .children('td')
                .first()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get(),
      areas_open: $ =>
        $('#expected-openings ~ .table-weather tbody')
          .first()
          .children('tr')
          .filter((i, row) =>
            /open/i.test(
              $(row)
                .children('td')
                .eq(1)
                .text()
                .trim(),
            ),
          )
          .map((i, row) =>
            $(row)
              .children('td')
              .first()
              .text(),
          )
          .get(),
      areas_closed: $ =>
        $('#expected-openings ~ .table-weather tbody')
          .first()
          .children('tr')
          .filter(
            (i, row) =>
              /closed/i.test(
                $(row)
                  .children('td')
                  .eq(1)
                  .text()
                  .trim(),
              ) &&
              !$(row)
                .children('td.route-progress')
                .has('.fa-check').length,
          )
          .map((i, row) =>
            $(row)
              .children('td')
              .first()
              .text(),
          )
          .get(),
      areas_pending: $ =>
        $('#expected-openings ~ .table-weather tbody')
          .first()
          .children('tr')
          .filter(
            (i, row) =>
              /closed/i.test(
                $(row)
                  .children('td')
                  .eq(1)
                  .text()
                  .trim(),
              ) &&
              $(row)
                .children('td.route-progress')
                .has('.fa-check').length,
          )
          .map((i, row) =>
            $(row)
              .children('td')
              .first()
              .text(),
          )
          .get(),
    },
    weatherSelectors: {
      summary_lastUpdated: $ => {
        const [, day, time] =
          $('#snow-fall ~ p')
            .first()
            .text()
            .match(/last updated (\w+) at ([^,]+),/i) || [];
        if (day && time) {
          const ts = moment.tz(
            `${moment.tz(tz).format('YYYY-MM-DD')} ${time}`,
            'YYYY-MM-DD h:mmA',
            tz,
          );
          if (day === 'yesterday') {
            ts.subtract(1, 'day');
          }
          return ts.toISOString();
        }
        return null;
      },
      summary_snowSince4amInches: $ =>
        findNumberInHTable('#snow-fall ~ .table-weather', /since 4am today/i)($) ??
        maybeFloat(
          $('#snow-fall ~ .table-weather tfoot')
            .first()
            .text()
            .match(/(\d+)[”"] since today at 4:00\s*am/i)?.[1],
        ),
      summary_snowSince4pmYesterdayInches: findNumberInHTable(
        '#snow-fall ~ .table-weather',
        /since 4pm yesterday/i,
      ),
      summary_snowSince4amYesterdayInches: findNumberInHTable(
        '#snow-fall ~ .table-weather',
        /since 4am yesterday/i,
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
      mid_hourlyWaterInches: findNumberInTable(weatherObservationsTable, 6),
      mid_waterSince4amInches: findNumberInTable(weatherObservationsTable, 7),
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
