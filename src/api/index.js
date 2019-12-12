// @flow
// This module is the root of the NLP API
import Router from 'express-promise-router';

import { getResortsData, getData } from '../scraper/scraper';
import resorts from '../scraper/resorts';
import type AppServer from '../AppServer';

// Middleware factory
export default function(server: AppServer) {
  const router = Router();

  router.get('/', async (req, res) => {
    res.json({ ready: true, id: server.id });
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
    res.json(await getData(resort));
  });

  return router;
}
