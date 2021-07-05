// @flow
import { Promise as Bluebird } from 'bluebird';
import cheerio from 'cheerio';
import { merge } from 'lodash';
import { mapValues } from 'lodash/fp';
import fetch from 'node-fetch';

export type PageScraper = {|
  url: string,
  statusSelectors?: {
    [string]: ($: Function) => string[],
  },
  weatherSelectors?: {
    [string]: ($: Function) => ?(string | number | void),
  },
  customFn?: ($: Function, url: string) => Promise<{ [string]: any }>,
|};

export type ScraperResult = {
  url: string,
  timestamp: Date,
  rawResponse: string,
  rawData?: any,
  status: {
    [string]: string[],
  },
  weather: {
    [string]: string,
  },
};

export type ResortScraper = PageScraper[];

export type ResortsData = {
  [resortName: string]: ScraperResult,
};

export type ScraperMap = {
  [resortName: string]: ResortScraper,
};

export const getPageData = async ({
  url,
  statusSelectors,
  weatherSelectors,
  customFn,
}: PageScraper): Promise<ScraperResult> => {
  const rawResponse = await fetch(url).then((r) => r.text());
  const $ = await cheerio.load(rawResponse);

  const scrapedData = {
    url,
    timestamp: new Date(),
    rawResponse,
    status: mapValues((s) => s($))(statusSelectors),
    weather: mapValues((s) => s($))(weatherSelectors),
  };

  const customData = (customFn && (await customFn($, url))) || {};

  return merge(scrapedData, customData);
};

export const getResortData = async (resortPages: ResortScraper): Promise<ScraperResult> => {
  return merge({}, ...(await Bluebird.map(resortPages, getPageData)));
};

export const getResortsData = async (resorts: ScraperMap): Promise<ResortsData> => {
  return Bluebird.props(mapValues(getResortData)(resorts));
};
