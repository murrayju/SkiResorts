// @flow
// This module is the root of the NLP API
import Router from 'express-promise-router';

import { getData } from '../scraper/scraper';
import { alta, snowbird } from '../scraper/resorts';
import type AppServer from '../AppServer';

// Middleware factory
export default function(server: AppServer) {
  const router = Router();

  router.get('/', async (req, res) => {
    return res.json({ ready: true, id: server.id });
  });

  router.get('/alta', async (req, res) => {
    return res.json(await getData(alta));
  });

  router.get('/snowbird', async (req, res) => {
    return res.json(await getData(snowbird));
  });

  return router;
}
