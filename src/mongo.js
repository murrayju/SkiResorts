// @flow
import config from '@murrayju/config';
import { MongoClient } from 'mongodb';
import type { Db } from 'mongodb';

let db: ?Db = null;
let mongoClient: ?MongoClient = null;

export async function init(): Promise<{ db: Db, mongoClient: MongoClient }> {
  const { url, user, password } = config.get('db');
  mongoClient = await MongoClient.connect(url, {
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
  // get/create the database
  db = mongoClient.db(config.get('db.name'));
  return { db, mongoClient };
}

export async function destroy(passed?: ?(Db | MongoClient) = mongoClient) {
  if (passed) {
    if (mongoClient && (passed === db || passed === mongoClient)) {
      await mongoClient.close();
      db = null;
      mongoClient = null;
    } else {
      // $FlowFixMe
      await passed.close?.();
    }
  }
}

export function getDb(): ?Db {
  return db;
}

export function getClient(): ?MongoClient {
  return mongoClient;
}
