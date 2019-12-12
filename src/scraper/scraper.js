import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { mapValues } from 'lodash/fp';
import { Promise } from 'bluebird';

export const getData = async ({ url, selectors }) => {
  const $ = await fetch(url)
    .then(r => r.text())
    .then(html => cheerio.load(html));

  return Object.keys(selectors).reduce(
    (obj, selector) => ({
      ...obj,
      [selector]: selectors[selector]($),
    }),
    {},
  );
};

export const getResortsData = async resorts => Promise.props(mapValues(getData)(resorts));
