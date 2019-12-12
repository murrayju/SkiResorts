// @flow
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import uuid from 'uuid/v4';
import type {
  $Request,
  $Response,
  NextFunction,
  Application,
  Server,
} from 'express';
import config from '@murrayju/config';

import apiRoot from './api';
import logger from './logger';

export default class AppServer {
  app: Application;
  connection: ?Server;
  port: ?number;
  id: string;

  constructor() {
    // Create the express app
    this.app = createApp(this);
    // a unique identifier for this server instance
    this.id = uuid();
  }

  async init(): Promise<AppServer> {
    const port = config.get('server.port');

    // Bind app to a port
    if (port != null) {
      this.port = port;
      this.connection = this.app.listen(port);
    }

    return this;
  }

  async destroy(): Promise<AppServer> {
    if (this.connection != null) {
      logger.debug('Shutting down http server...');
      await new Promise(resolve => {
        if (!this.connection) {
          resolve(logger.debug('Http server already closed.'));
          return;
        }
        this.connection.close(() =>
          resolve(logger.debug('Http server closed.')),
        );
      });
      this.connection = null;
    }
    return this;
  }
}

// Creates the Express web app
function createApp(server: AppServer) {
  const app = express();
  // Root-level middleware
  app.use(cookieParser());
  // all requests get a correlationId and clientId
  app.use((req, res, next) => {
    // use a cookie to identify clients
    const clientId = req.cookies.clientId || uuid();
    res.cookie('clientId', clientId);
    // namespace all extra parameters under req.ski (more get added later)
    req.ski = {
      clientId,
      correlationId: uuid(),
    };
    res.ski = {};
    next();
  });
  // attach logger to all requests
  // app.use(loggerHttpMiddleware());

  // CORS stuff
  app.use(cors());

  // API middleware
  app.use('/api', apiRoot(server));

  // Custom error handler
  app.use(
    (
      err: Error & { statusCode?: number },
      req: $Request,
      res: $Response,
      // eslint-disable-next-line no-unused-vars
      next: NextFunction,
    ) => {
      const statusCode: number =
        (typeof err.statusCode === 'number'
          ? err.statusCode
          : parseInt(err.statusCode, 10)) || 500;
      logger.debug(
        `Exception caught in top level express error handler: ${err.message}`,
      );
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

  return app;
}
