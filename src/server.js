// @flow
import config from '@murrayju/config';
import path from 'path';
import express from 'express';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { CookiesProvider } from 'react-cookie';
import cookiesMiddleware from 'universal-cookie-express';
import PrettyError from 'pretty-error';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { renderStylesToString } from 'emotion-server';
import bodyParser from 'body-parser';
import type { Db, MongoClient } from 'mongodb';
import { type CronJob } from 'cron';

import { handleNodeProcessEvents, unregisterNodeProcessEvents } from './nodeProcessEvents';
import App from './components/App';
import Html from './components/Html';
import ErrorPage from './components/ErrorPage';
import createFetch from './createFetch';
import router from './router';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
// $FlowFixMe
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import AppContext from './contexts/AppContext';
import api from './api';
import * as mongo from './mongo';
import { createScraperCron } from './scraper/cron';
import Emitter from './scraper/emitter';
import dataListener from './events/DataListener';
import alertListener from './events/AlertListener';

export type ServerContext = {
  db: Db,
  emitter: Emitter,
};

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';
global.navigator.platform = global.navigator.platform || 'linux';
global.navigator.appName = global.navigator.appName || 'Chrome';

type AppInfo = {
  app: express$Application<>,
  connection: ?http$Server,
  cronJob: CronJob,
  db: Db,
  mongoClient: MongoClient,
  destroy: () => Promise<void>,
};

const createApp = async (): Promise<AppInfo> => {
  handleNodeProcessEvents();

  const app = express();

  //
  // If you are using proxy from external machine, you can set TRUST_PROXY env
  // Default is to trust proxy headers only from loopback interface.
  // -----------------------------------------------------------------------------
  app.set('trust proxy', config.get('server.trustProxy'));

  //
  // Register Node.js middleware
  // -----------------------------------------------------------------------------
  app.use(express.static(path.resolve(__dirname, 'public')));
  app.use(cookiesMiddleware());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // initialize the db
  const { db, client: mongoClient } = await mongo.init();
  const emitter = new Emitter();
  const serverContext: ServerContext = { db, emitter };
  const cronJob = createScraperCron(serverContext);
  dataListener(serverContext);
  alertListener(serverContext);

  app.use('/api', api(serverContext));

  const port = config.get('server.port');
  const serverUrl = config.get('server.serverUrl') || `http://localhost:${port}`;
  const clientUrl = config.get('server.clientUrl');

  //
  // Register server-side rendering middleware
  // -----------------------------------------------------------------------------
  app.get('*', async (req: express$Request, res: express$Response, next: express$NextFunction) => {
    try {
      // $FlowFixMe
      const cookies = req.universalCookies;

      // Universal HTTP client
      const fetch = createFetch(nodeFetch, {
        baseUrl: serverUrl,
        cookie: req.headers.cookie,
      });

      // Global (context) variables that can be easily accessed from any React component
      // https://facebook.github.io/react/docs/context.html
      const context = {
        fetch,
        pathname: req.path,
        query: req.query,
        cookies,
      };

      const route = await router.resolve(context);

      if (route.redirect) {
        res.redirect(route.status || 302, route.redirect);
        return;
      }

      // styled-components
      const sheet = new ServerStyleSheet();

      const data = { ...route };
      data.children = renderStylesToString(
        ReactDOM.renderToString(
          <StyleSheetManager sheet={sheet.instance}>
            <CookiesProvider cookies={cookies}>
              <AppContext.Provider value={context}>
                <App>{route.component}</App>
              </AppContext.Provider>
            </CookiesProvider>
          </StyleSheetManager>,
        ),
      );
      data.styleTags = sheet.getStyleElement();

      const scripts = new Set();
      const addChunk = chunk => {
        if (chunks[chunk]) {
          chunks[chunk].forEach(asset => scripts.add(asset));
          // $FlowFixMe
        } else if (__DEV__) {
          throw new Error(`Chunk with name '${chunk}' cannot be found`);
        }
      };
      addChunk('client');
      if (route.chunk) addChunk(route.chunk);
      if (route.chunks) route.chunks.forEach(addChunk);

      data.scripts = Array.from(scripts);
      data.app = {
        apiUrl: clientUrl,
      };

      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(route.status || 200);
      res.send(`<!doctype html>${html}`);
    } catch (err) {
      next(err);
    }
  });

  //
  // Error handling
  // -----------------------------------------------------------------------------
  const pe = new PrettyError();
  pe.skipNodeFiles();
  pe.skipPackage('express');

  // $FlowFixMe
  app.use(
    (
      err,
      req,
      res,
      // eslint-disable-next-line no-unused-vars
      next,
    ) => {
      console.error(pe.render(err));
      const sheet = new ServerStyleSheet();
      const innerHtml = ReactDOM.renderToString(sheet.collectStyles(<ErrorPage error={err} />));
      const html = ReactDOM.renderToStaticMarkup(
        <Html
          title="Internal Server Error"
          description={err.message}
          styleTags={sheet.getStyleElement()}
        >
          {innerHtml}
        </Html>,
      );
      res.status(err.status || 500);
      res.send(`<!doctype html>${html}`);
    },
  );

  //
  // Launch the server
  // -----------------------------------------------------------------------------
  let connection = null;
  // $FlowFixMe
  if (!module.hot) {
    connection = app.listen(port, () => {
      console.info(`The server is running at ${serverUrl}`);
    });

    // Handle kill signal (something isn't playing nicely)
    ['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => process.exit(0)));
  }

  //
  // Hot Module Replacement
  // -----------------------------------------------------------------------------
  // $FlowFixMe
  if (module.hot) {
    // $FlowFixMe
    app.hot = module.hot;
    // $FlowFixMe
    module.hot.accept('./router');
  }

  return {
    app,
    connection,
    cronJob,
    db,
    mongoClient,
    async destroy() {
      connection?.close();
      cronJob.stop();
      emitter.removeAllListeners();
      await mongo.destroy(mongoClient);
      unregisterNodeProcessEvents();
    },
  };
};

// $FlowFixMe
if (!module.hot) {
  // entry point
  createApp().catch(err => console.error('Failed to create app', err));
}

export default createApp;
