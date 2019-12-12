// @flow
// Must import config before anything else (here, in the entrypoint), or risk not properly merging config
import '@murrayju/config';

import logger from './logger';
import AppServer from './AppServer';
import * as mongo from './mongo';
import { createScraperCron } from './scraper/cron';
import handleNodeProcessEvents from './nodeProcessEvents';

const startup = async () => {
  handleNodeProcessEvents();
  const db = await mongo.init();
  const app = new AppServer();
  await app.init();
  if (app.connection) {
    app.connection.on('close', () => {
      logger.info('Server disconnected.');
    });
    if (app.port != null) {
      const msg = `Listening on port ${app.port}...`;
      logger.info(msg);
      // tests depend on this output to always indicate that the server is up and ready
      console.info(msg);

      // Listen for kill signal from nodemon
      const killSig = process.env.NODEMON_KILL_SIG;
      if (killSig) {
        process.once(killSig, () => {
          process.kill(process.pid, killSig);
        });
      }
    }
  }
  createScraperCron(db);
};

startup().catch(err => {
  console.error(err);
  logger.error('Failed to start the server.', err);
  process.exit(-1);
});
