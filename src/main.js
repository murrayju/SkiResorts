// @flow
// Must import config before anything else (here, in the entrypoint), or risk not properly merging config
import '@murrayju/config';

import logger from './logger';
import AppServer from './AppServer';
import * as mongo from './mongo';
import { createScraperCron } from './scraper/cron';
import handleNodeProcessEvents from './nodeProcessEvents';

let app = null;
let db = null;
const startup = async () => {
  handleNodeProcessEvents();
  db = await mongo.init();
  app = await new AppServer().init(db);
  createScraperCron(db);
};

const shutdown = async () => {
  await app?.destroy();
  app = null;
  await mongo.destroy(db);
  db = null;
};

// Listen for kill signal from nodemon
const killSig = process.env.NODEMON_KILL_SIG;
if (killSig) {
  process.once(killSig, async () => {
    await shutdown();
    process.kill(process.pid, killSig);
  });
}

startup().catch(async err => {
  console.error(err);
  logger.error('Failed to start the server.', err);
  await shutdown();
  process.exit(-1);
});
