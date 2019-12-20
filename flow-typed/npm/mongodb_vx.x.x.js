// flow-typed signature: 36302c4833dc50f68745402ec5fa5a34
// flow-typed version: <<STUB>>/mongodb_v3.4.1/flow_v0.114.0

declare class MongoDB$ObjectID {
  /**
   * Create a new ObjectID instance
   * @param {(string|number|MongoDB$ObjectID)} id Can be a 24 byte hex string, 12 byte binary string or a Number.
   */
  constructor(id?: string | number | MongoDB$ObjectID): this;

  /** The generation time of this ObjectID instance */
  generationTime: number;

  /**
   * Creates an ObjectID from a hex string representation of an ObjectID.
   * @param {string} hexString create a ObjectID from a passed in 24 byte hexstring.
   * @return {ObjectID} return the created ObjectID
   */
  static createFromHexString(hexString: string): MongoDB$ObjectID;

  /**
   * Creates an ObjectID from a second based number, with the rest of the ObjectID zeroed out. Used for comparisons or sorting the ObjectID.
   * @param {number} time an integer number representing a number of seconds.
   * @return {ObjectID} return the created ObjectID
   */
  static createFromTime(time: number): MongoDB$ObjectID;

  /**
   * Checks if a value is a valid bson ObjectID
   *
   * @return {boolean} return true if the value is a valid bson ObjectID, return false otherwise.
   */
  static isValid(id: string | number | MongoDB$ObjectID): boolean;

  /**
   * Compares the equality of this ObjectID with `otherID`.
   * @param {object} otherID ObjectID instance to compare against.
   * @return {boolean} the result of comparing two ObjectID's
   */
  equals(otherID: MongoDB$ObjectID): boolean;

  /**
   * Generate a 12 byte id string used in ObjectID's
   * @param {number} time optional parameter allowing to pass in a second based timestamp.
   * @return {string} return the 12 byte id binary string.
   */
  generate(time?: number): string;

  /**
   * Returns the generation date (accurate up to the second) that this ID was generated.
   * @return {date} the generation date
   */
  getTimestamp(): Date;

  /**
   * Return the ObjectID id as a 24 byte hex string representation
   * @return {string} return the 24 byte hex string representation.
   */
  toHexString(): string;
}

declare type resultCallback<T> = (error?: ?Error, result: T) => void;
declare type connectCallback = resultCallback<MongoDB$Db>;
declare type connectOptions = {
  uri_decode_auth?: boolean,
  db?: Object,
  server?: Object,
  replSet?: Object,
  mongos?: Object,
  promiseLibrary?: Object,
};

declare class MongoDB$MongoClient {
  constructor(): this;
  static connect(
    url: string,
    options?: connectOptions,
    callback?: connectCallback,
  ): Promise<MongoDB$Db>;
}

declare class MongoDB$Db {
  constructor(databaseName: string, topology: any, options?: Object): this;

  databaseName: string;
  bufferMaxEntries: number;
  options: Object;

  addUser(
    username: string,
    password: string,
    options?: Object,
    callback?: resultCallback<Object>,
  ): Promise<Object>;

  close(force?: boolean, callback?: resultCallback<void>): Promise<void>;

  collection(name: string, options?: ?Object): MongoDB$Collection;

  db(
    name: string,
    options?: { noListener?: boolean, returnNonCachedInstance?: boolean },
  ): MongoDB$Db;
}

declare module 'mongodb' {
  declare module.exports: {
    // TODO: provide remaining definitions, currently using 'any' to avoid errors
    Admin: any,
    BSONRegExp: any,
    Binary: any,
    Chunk: any,
    Code: any,
    Collection: any,
    connect: any,
    CoreConnection: any,
    CoreServer: any,
    Cursor: any,
    DBRef: any,
    Db: Class<MongoDB$Db>,
    Decimal128: any,
    Double: any,
    GridFSBucket: any,
    GridStore: any,
    instrument: any,
    Int32: any,
    Logger: any,
    Long: any,
    Map: any,
    MaxKey: any,
    MinKey: any,
    MongoClient: Class<MongoDB$MongoClient>,
    MongoError: any,
    Mongos: any,
    ObjectID: Class<MongoDB$ObjectID>,
    ObjectId: Class<MongoDB$ObjectID>,
    ReadPreference: any,
    ReplSet: any,
    Server: any,
    Symbol: any,
    Timestamp: any,
    ...
  };
}
