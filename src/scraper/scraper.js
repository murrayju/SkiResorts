// @flow
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { mapValues } from 'lodash/fp';
import { merge } from 'lodash';
import { Promise as Bluebird } from 'bluebird';

export type PageScraper = {
  url: string,
  selectors: {
    [string]: ($: Function) => string[],
  },
};

export type ScraperResult = {
  [string]: string[],
};

export type ResortScraper = PageScraper[];

export type ResortsData = {
  [resortName: string]: ScraperResult,
};

export type ScraperMap = {
  [resortName: string]: ResortScraper,
};

export const getPageData = async ({ url, selectors }: PageScraper): Promise<ScraperResult> => {
  const $ = await fetch(url)
    .then(r => r.text())
    .then(html => cheerio.load(html));

  return mapValues(s => s($))(selectors);
};

export const getResortData = async (resortPages: ResortScraper): Promise<ScraperResult> => {
  return merge({}, ...(await Bluebird.map(resortPages, getPageData)));
};

export const getResortsData = async (resorts: ScraperMap): Promise<ResortsData> => {
  return Bluebird.props(mapValues(getResortData)(resorts));
};
