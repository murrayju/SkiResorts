// @flow
import Router from 'express-promise-router';
import cors from 'cors';
import type { Db } from 'mongodb';
import cookieParser from 'cookie-parser';
import uuid from 'uuid/v4';

import { getResortsData, getResortData } from '../scraper/scraper';
import resorts from '../scraper/resorts';
import aggregator from './aggregator';
// $FlowFixMe - generated file
import { version } from '../version._generated_'; // eslint-disable-line import/no-unresolved
import logger from '../logger';

export type ApiRequestContext = {
  correlationId: string,
  clientId: string,
  db: Db,
};

export type ApiRequest = {
  body: any,
  params: { [string]: string },
  query: { [string]: string },
  ski: ApiRequestContext,
};

// Middleware factory
export default function(db: Db) {
  const router = Router();

  router.use(cors());
  router.use(cookieParser());
  // all requests get a correlationId and clientId
  router.use(async (req, res, next) => {
    // use a cookie to identify clients
    const clientId = req.cookies.clientId || uuid();
    res.cookie('clientId', clientId);
    // namespace all extra parameters under req.ski (more get added later)
    req.ski = {
      correlationId: uuid(),
      clientId,
      db,
    };
    res.ski = {};
    next();
  });

  router.get('/', async (req, res) => {
    res.json({ ready: true });
  });

  router.get('/version', async (req, res) => {
    res.json(version);
  });

  router.get('/resort', async (req, res) => {
    res.json(await getResortsData(resorts));
  });

  router.get('/resort/:resort', async (req, res) => {
    const resort = resorts[req.params.resort];
    if (!resort) {
      res.status(404).send();
      return;
    }
    res.json(await getResortData(resort));
  });

  router.get('/stats/:thing', async (req: ApiRequest, res) => {
    res.json(
      await db
        .collection(req.params.thing)
        .aggregate(aggregator, { allowDiskUse: true })
        .toArray(),
    );
  });

  // Custom error handler
  router.use(
    (
      err: Error & { statusCode?: number },
      req,
      res,
      // eslint-disable-next-line no-unused-vars
      next,
    ) => {
      const statusCode: number =
        (typeof err.statusCode === 'number' ? err.statusCode : parseInt(err.statusCode, 10)) || 500;
      logger.debug(`Exception caught in top level express error handler: ${err.message}`);
      let logLevel = 'info';
      if (statusCode === 401) {
        // auth failures aren't a real problem
        logLevel = 'debug';
      } else if (statusCode >= 500) {
        // 500 errors represent an internal server error
        logLevel = 'error';
      }
      logger.log(logLevel, err.toString(), err);
      const { message } = err;
      return res.status(statusCode).json({ message });
    },
  );

  return router;
}
