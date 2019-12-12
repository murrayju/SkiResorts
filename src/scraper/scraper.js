import cheerio from 'cheerio';
import request from 'request-promise';

export const getPageData = async ({ url, selectors }) => {
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

export const getResortData = async resortPages => {
  return resortPages.reduce(async (resortData, page) => {
    console.log(page.url);
    const data = await getPageData(page);
    console.log(data);
    return { ...(await resortData), ...data };
  }, {});
};
