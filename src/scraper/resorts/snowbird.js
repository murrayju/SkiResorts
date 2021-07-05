// @flow
import { isNaN } from 'lodash';
import moment from 'moment-timezone';

import type { ResortScraper } from '../scraper';

const maybeFloat = (str: mixed): ?number => {
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
};

const windRegex = /\s*([^@]+)@(\d+)(?:-(\d+))?/i;
const findCondition = (regex: RegExp) => ($) =>
  $('.conditions-data .conditions > div')
    .filter((i, item) => regex.test($(item).children('.sb-condition_label').text()))
    .map((i, item) => $(item).find('.sb-condition_value').text().trim())
    .get()[0];

const findConditionNum = (regex: RegExp) => ($) => maybeFloat(findCondition(regex)($));

const tz = 'America/Denver';
const getUpdatedTime = ($) =>
  moment
    .tz(
      `${moment.tz(tz).format('YYYY-MM-DD')} ${$('.conditions-header .date-display span')
        .text()
        .trim()}`,
      'YYYY-MM-DD h:mm a',
      'America/Denver',
    )
    .toISOString();

const snowbird: ResortScraper = [
  {
    url: 'https://www.snowbird.com/mountain-report/',
    statusSelectors: {
      areas_open: ($) =>
        $('.snow-report-gates .listings .open .title')
          .map((i, item) => $(item).text())
          .get(),
      areas_closed: ($) =>
        $('.snow-report-gates .listings .closed .title')
          .map((i, item) => $(item).text())
          .get(),
      areas_pending: ($) =>
        $('.snow-report-gates .listings .pending .title')
          .map((i, item) => $(item).text())
          .get(),
    },
    weatherSelectors: {
      summary_lastUpdated: getUpdatedTime,
      summary_12hrSnowInches: findConditionNum(/12hr/i),
      summary_24hrSnowInches: findConditionNum(/24hr/i),
      summary_48hrSnowInches: findConditionNum(/48hr/i),
      summary_seasonTotalInches: findConditionNum(/ytd/i),
      summary_baseDepthInches: findConditionNum(/depth/i),
      base_lastUpdated: getUpdatedTime,
      base_tempF: findConditionNum(/base temp/i),
      mid_lastUpdated: getUpdatedTime,
      mid_tempF: findConditionNum(/mid-mtn temp/i),
      top_lastUpdated: getUpdatedTime,
      top_tempF: findConditionNum(/peak temp/i),
      top_windSpeedMph: ($) => {
        const [, , min, max] = findCondition(/wind speed/i)($).match(windRegex) || [];
        const result = min && max ? (parseFloat(min) + parseFloat(max)) / 2 : parseFloat(min);
        return isNaN(result) ? null : result;
      },
      top_windGustMph: ($) => {
        const [, , , max] = findCondition(/wind speed/i)($).match(windRegex) || [];
        return maybeFloat(max);
      },
      top_windDirection: ($) => findCondition(/wind speed/i)($).match(windRegex)?.[1],
    },
  },
  {
    url: 'https://www.snowbird.com/lifts-trails/',
    statusSelectors: {
      lifts_open: ($) =>
        $('.snow-report-lifts .listings .open .title')
          .map((i, item) => $(item).text())
          .get(),
      lifts_closed: ($) =>
        $('.snow-report-lifts .listings .closed .title')
          .map((i, item) => $(item).text())
          .get(),
      lifts_pending: ($) =>
        $('.snow-report-lifts .listings .pending .title')
          .map((i, item) => $(item).text())
          .get(),
      runs_open: ($) =>
        $('.snow-report-trails .listings .open .title')
          .map((i, item) => $(item).text())
          .get()
          .filter((item) => item !== 'Alpine Trail'),
      runs_closed: ($) =>
        $('.snow-report-trails .listings .closed .title')
          .map((i, item) => $(item).text())
          .get()
          .filter((item) => item !== 'Alpine Trail'),
      runs_pending: ($) =>
        $('.snow-report-trails .listings .pending .title')
          .map((i, item) => $(item).text())
          .get()
          .filter((item) => item !== 'Alpine Trail'),
    },
  },
];
export default snowbird;
