import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { mapValues } from 'lodash/fp';
import { Promise } from 'bluebird';

export const getPageData = async ({ url, selectors }) => {
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

export const getResortData = async resortPages => {
  return resortPages.reduce(async (resortData, page) => {
    console.log(page.url);
    const data = await getPageData(page);
    console.log(data);
    return { ...(await resortData), ...data };
  }, {});
};

export const getResortsData = async resorts => Promise.props(mapValues(getResortData)(resorts));
