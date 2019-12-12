// @flow
/* eslint-disable global-require */
// Must import config before anything else (here, in the entrypoint), or risk not properly merging config
import '@murrayju/config';

import logger from './logger';
import AppServer from './AppServer';
import * as mongo from './mongo';
import { startScraperCron } from './scraper/cron';

// Top level event logging
process.on('exit', code => logger.info(`Process exiting with code: ${code}`));
process.on('warning', error =>
  logger.warn(`Node<warning>: ${error?.message}`, error),
);
process.on('uncaughtException', error => {
  console.error(error);
  logger.error('Node<uncaughtException>', error);
  // Process must exit
  setImmediate(() => process.exit(1));
});
process.on('multipleResolves', (type, promise, reason) => {
  logger.error('Node<multipleResolves>', { type, promise, reason });
  // exit recommended, but this may be a breaking change (let's see if it ever happens)
  // setImmediate(() => process.exit(1));
});
const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
  logger.error('Node<unhandledRejection>', {
    promise,
    reason,
    count: unhandledRejections.size,
  });
});
process.on('rejectionHandled', promise => {
  unhandledRejections.delete(promise);
  logger.info('Node<rejectionHandled>', {
    promise,
    count: unhandledRejections.size,
  });
});

mongo.init().then(() => startApp());

const startApp = () => {
  // Was run as app entry point, start the server
  const server = new AppServer();
  server
    .init()
    .then(() => {
      if (server.connection) {
        server.connection.on('close', () => {
          logger.info('Server disconnected.');
        });
        if (server.port != null) {
          const msg = `Listening on port ${server.port}...`;
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
    })
    .catch(err => {
      console.error(err);
      logger.error('Failed to initialize the server.', err);
      process.exit(-1);
    });
};

startScraperCron();
