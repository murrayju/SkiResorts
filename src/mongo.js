import config from '@murrayju/config';
import { MongoClient } from 'mongodb';

let db = null;

export function init() {
  const { url, user, password } = config.get('db');
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      {
        useUnifiedTopology: true,
        ...(user && password
          ? {
              auth: {
                user,
                password,
              },
            }
          : null),
      },
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
