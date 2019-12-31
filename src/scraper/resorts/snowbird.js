// @flow
import { isNaN } from 'lodash';
import type { ResortScraper } from '../scraper';

const windRegex = /\s*([^@]+)@([^m]+mph)/i;
const findCondition = (regex: RegExp) => $ =>
  $('.conditions-data .conditions > div')
    .filter((i, item) =>
      regex.test(
        $(item)
          .children('.sb-condition_label')
          .text(),
      ),
    )
    .map((i, item) =>
      $(item)
        .find('.sb-condition_value')
        .text()
        .trim(),
    )
    .get()[0];

const findConditionNum = (regex: RegExp) => $ => {
  const num = parseFloat(findCondition(regex)($));
  return isNaN(num) ? undefined : num;
};

const snowbird: ResortScraper = [
  {
    url: 'https://www.snowbird.com/mountain-report/',
    statusSelectors: {
      areas_open: $ =>
        $('.snow-report-gates .listings .open .title')
          .map((i, item) => $(item).text())
          .get(),
      areas_closed: $ =>
        $('.snow-report-gates .listings .closed .title')
          .map((i, item) => $(item).text())
          .get(),
      areas_pending: $ =>
        $('.snow-report-gates .listings .pending .title')
          .map((i, item) => $(item).text())
          .get(),
    },
    weatherSelectors: {
      inches12hr: findConditionNum(/12hr/i),
      inches24hr: findConditionNum(/24hr/i),
      inches48hr: findConditionNum(/48hr/i),
      seasonTotalInches: findConditionNum(/ytd/i),
      baseDepthInches: findConditionNum(/depth/i),
      currentTempMidMtnF: findConditionNum(/mid-mtn temp/i),
      currentTempBaseF: findConditionNum(/base temp/i),
      windSpeed: $ => findCondition(/wind speed/i)($).match(windRegex)?.[2],
      windDirection: $ => findCondition(/wind speed/i)($).match(windRegex)?.[1],
    },
  },
  {
    url: 'https://www.snowbird.com/lifts-trails/',
    statusSelectors: {
      lifts_open: $ =>
        $('.snow-report-lifts .listings .open .title')
          .map((i, item) => $(item).text())
          .get(),
      lifts_closed: $ =>
        $('.snow-report-lifts .listings .closed .title')
          .map((i, item) => $(item).text())
          .get(),
      lifts_pending: $ =>
        $('.snow-report-lifts .listings .pending .title')
          .map((i, item) => $(item).text())
          .get(),
      runs_open: $ =>
        $('.snow-report-trails .listings .open .title')
          .map((i, item) => $(item).text())
          .get()
          .filter(item => item !== 'Alpine Trail'),
      runs_closed: $ =>
        $('.snow-report-trails .listings .closed .title')
          .map((i, item) => $(item).text())
          .get()
          .filter(item => item !== 'Alpine Trail'),
      runs_pending: $ =>
        $('.snow-report-trails .listings .pending .title')
          .map((i, item) => $(item).text())
          .get()
          .filter(item => item !== 'Alpine Trail'),
    },
  },
];
export default snowbird;
