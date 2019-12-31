// @flow
import { isNaN } from 'lodash';
import type { ResortScraper } from '../scraper';

const findInTable = ($, tableSelector: string, heading: RegExp, col?: number = 0): string =>
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

const findNumberInTable = (
  $,
  tableSelector: string,
  heading: RegExp,
  col?: number = 0,
): ?number => {
  const num = parseFloat(findInTable($, tableSelector, heading, col));
  return isNaN(num) ? undefined : num;
};

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
      inchesToday: $ => findNumberInTable($, '#snow-fall ~ .table-weather', /since 4am today/i),
      inchesSinceCloseYesterday: $ =>
        findNumberInTable($, '#snow-fall ~ .table-weather', /since 4pm yesterday/i),
      stormTotalInches: $ => findNumberInTable($, '#snow-fall ~ .table-weather', /storm total/i),
      seasonTotalInches: $ => findNumberInTable($, '#snow-fall ~ .table-weather', /season total/i),
      baseDepthInches: $ =>
        findNumberInTable($, '#snow-fall ~ .table-weather', /mid mountain depth/i),
      currentTempMidMtnF: $ =>
        findNumberInTable($, '#current-conditions ~ .table-weather', /mid mountain temp/i),
      skyCover: $ => findInTable($, '#current-conditions ~ .table-weather', /sky cover/i, 1),
      windSpeed: $ => findInTable($, '#current-conditions ~ .table-weather', /ridgetop winds/i),
      windDirection: $ =>
        findInTable($, '#current-conditions ~ .table-weather', /ridgetop winds/i, 1),
    },
  },
];

export default alta;
