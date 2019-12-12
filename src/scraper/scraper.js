import cheerio from 'cheerio';
import request from 'request-promise';

export const getData = async ({ url, selectors }) => {
  const $ = await request({
    uri: url,
    transform: body => cheerio.load(body),
  });

  return Object.keys(selectors).reduce(
    (obj, selector) => ({
      ...obj,
      [selector]: selectors[selector]($),
    }),
    {},
  );
};
