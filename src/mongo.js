// @flow
import config from '@murrayju/config';
import { MongoClient } from 'mongodb';
import type { Db } from 'mongodb';

let db: ?Db = null;

export async function init(): Promise<Db> {
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
  // get/create the database
  db = client.db(config.get('db.name'));
  return db;
}

export async function destroy(passedDb?: ?Db = db) {
  if (passedDb) {
    await passedDb?.close();
    if (passedDb === db) {
      db = null;
    }
  }
}

export function getDb(): ?Db {
  return db;
}
