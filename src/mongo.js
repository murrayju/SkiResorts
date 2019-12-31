// @flow
import config from '@murrayju/config';
import { MongoClient } from 'mongodb';
import type { Db } from 'mongodb';

import { entries } from './util/maps';

let mongoDb: ?Db = null;
let mongoClient: ?MongoClient = null;

export async function init(): Promise<{ db: Db, client: MongoClient }> {
  const { url, user, password } = config.get('db');
  const client = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    ...(user && password
      ? {
          auth: {
            user,
            password,
          },
        }
      : null),
  });
  mongoClient = client;

  // get/create the database
  const db = mongoClient.db(config.get('db.name'));
  mongoDb = db;

  // ensure all indexes exist
  await Promise.all(
    entries(config.get('db.collections')).map(async ([name, cfg]) => {
      if (cfg.indexes?.length) {
        await db.collection(name).createIndexes(cfg.indexes);
      }
    }),
  );

  return { db, client };
}

export async function destroy(passed?: ?(Db | MongoClient) = mongoClient) {
  if (passed) {
    if (mongoClient && (passed === mongoDb || passed === mongoClient)) {
      await mongoClient.close();
      mongoDb = null;
      mongoClient = null;
    } else {
      // $FlowFixMe
      await passed.close?.();
    }
  }
}

export function getDb(): ?Db {
  return mongoDb;
}

export function getClient(): ?MongoClient {
  return mongoClient;
}
