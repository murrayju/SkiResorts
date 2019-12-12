import config from '@murrayju/config';
import { MongoClient } from 'mongodb';

let db = null;

export function init() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      config.get('db.url'),
      { useUnifiedTopology: true },
      function(err, client) {
        if (err) {
          return reject(err);
        }
        db = client.db(config.get('db.name'));
        return resolve(db);
      },
    );
  });
}

export function getDb() {
  return db;
}
