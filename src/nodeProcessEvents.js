// @flow
import '@murrayju/config';

import logger from './logger';

export default function handleNodeProcessEvents() {
  // Top level event logging
  process.on('exit', code => logger.info(`Process exiting with code: ${code}`));
  process.on('warning', error => logger.warn(`Node<warning>: ${error?.message}`, error));
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
}
