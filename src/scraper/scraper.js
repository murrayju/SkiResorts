import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { mapValues } from 'lodash/fp';
import { merge } from 'lodash';
import { Promise } from 'bluebird';

export const getPageData = async ({ url, selectors }) => {
  const $ = await fetch(url)
    .then(r => r.text())
    .then(html => cheerio.load(html));

  return mapValues(s => s($))(selectors);
};

export const getResortData = async resortPages => {
  return merge({}, ...(await Promise.map(resortPages, getPageData)));
};

export const getResortsData = async resorts => {
  return Promise.props(mapValues(getResortData)(resorts));
};
