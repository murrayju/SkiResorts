// flow-typed signature: 40091b6f628e09a1939090cf2be323c0
// flow-typed version: <<STUB>>/mongodb_v3/flow_v0.114.0
import { Binary, ObjectId, Timestamp } from 'bson';
import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';
import { checkServerIdentity } from 'tls';

declare module 'mongodb' {
  declare type Omit<T, K> = Pick<T, Exclude<$Keys<T>, K>>;
  declare export function connect(uri: string, options?: MongoClientOptions): Promise<MongoClient>;
  declare export function connect(uri: string, callback: MongoCallback<MongoClient>): void;
  declare export function connect(
    uri: string,
    options: MongoClientOptions,
    callback: MongoCallback<MongoClient>,
  ): void;
  declare export {
    Binary,
    DBRef,
    Decimal128,
    Double,
    Int32,
    Long,
    MaxKey,
    MinKey,
    ObjectID,
    ObjectId,
    Timestamp,
  } from 'bson';
  declare export class MongoClient extends EventEmitter {
    constructor(uri: string, options?: MongoClientOptions): this;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#.connect
     */
    static connect(uri: string, options?: MongoClientOptions): Promise<MongoClient>;
    // static connect(uri: string, callback: MongoCallback<MongoClient>): void;
    // static connect(
    //   uri: string,
    //   options: MongoClientOptions,
    //   callback: MongoCallback<MongoClient>,
    // ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#connect
     */
    connect(): Promise<MongoClient>;
    connect(callback: MongoCallback<MongoClient>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#close
     */
    close(callback: MongoCallback<void>): void;
    close(force?: boolean): Promise<void>;
    close(force: boolean, callback: MongoCallback<void>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#db
     */
    db(dbName?: string, options?: MongoClientCommonOption): Db;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#isConnected
     */
    isConnected(options?: MongoClientCommonOption): boolean;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#logout
     */
    logout(callback: MongoCallback<any>): void;
    logout(options?: {
      dbName?: string,
      ...
    }): Promise<any>;
    logout(
      options: {
        dbName?: string,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#startSession
     */
    startSession(options?: SessionOptions): ClientSession;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.3/api/MongoClient.html#watch
     */
    watch(
      pipeline?: { [key: string]: any }[],
      options?: ChangeStreamOptions & {
        session?: ClientSession,
        ...
      },
    ): ChangeStream;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#withSession
     */
    withSession(operation: (session: ClientSession) => Promise<any>): Promise<void>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#withSession
     */
    withSession(
      options: SessionOptions,
      operation: (session: ClientSession) => Promise<any>,
    ): Promise<void>;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/ClientSession.html
   */
  declare export type ClientSession = {
    /**
     * The server id associated with this session
     */
    id: any,

    /**
     * Aborts the currently active transaction in this session.
     * @param cb Optional callback for completion of this operation
     */
    abortTransaction(cb?: MongoCallback<void>): Promise<void>,

    /**
     * Advances the operationTime for a ClientSession.
     */
    advanceOperationTime(operationTime: Timestamp): void,

    /**
     * Commits the currently active transaction in this session.
     * @param cb Optional callback for completion of this operation
     */
    commitTransaction(cb?: MongoCallback<void>): Promise<void>,

    /**
     * Ends this session on the server
     * @param cb Optional callback for completion of this operation
     */
    endSession(cb?: MongoCallback<void>): void,

    /**
     * Ends this session on the server
     * @param options Optional settings. Currently reserved for future use
     * @param cb Optional callback for completion of this operation
     */
    endSession(options: any, cb?: MongoCallback<void>): void,

    /**
     * Used to determine if this session equals another
     * @param session A class representing a client session on the server
     * @returns Whether the sessions are equal
     */
    equals(session: ClientSession): boolean,

    /**
     * Increment the transaction number on the internal ServerSession
     */
    incrementTransactionNumber(): void,

    /**
     * @returns Whether this session is currently in a transaction or not
     */
    inTransaction(): boolean,

    /**
     * Starts a new transaction with the given options.
     */
    startTransaction(options?: TransactionOptions): void,

    /**
     * Runs a provided lambda within a transaction, retrying either the commit operation
     * or entire transaction as needed (and when the error permits) to better ensure that
     * the transaction can complete successfully.
     *
     * IMPORTANT: This method requires the user to return a Promise, all lambdas that do not
     * return a Promise will result in undefined behavior.
     * @param fn Function to execute with the new session.
     * @param options Optional settings for the transaction
     */
    withTransaction<T>(fn: WithTransactionCallback<T>, options?: TransactionOptions): Promise<void>,
    ...
  } & EventEmitter;
  declare type ReadConcernLevel = 'local' | 'available' | 'majority' | 'linearizable' | 'snapshot';
  /**
   * The MongoDB ReadConcern, which allows for control of the consistency and isolation properties
   * of the data read from replica sets and replica set shards.
   * http://mongodb.github.io/node-mongodb-native/3.1/api/global.html#ReadConcern
   */
  declare export type ReadConcern = {
    level: ReadConcernLevel,
  };
  /**
   * A MongoDB WriteConcern, which describes the level of acknowledgement
   * requested from MongoDB for write operations.
   * http://mongodb.github.io/node-mongodb-native/3.1/api/global.html#WriteConcern
   */
  declare type WriteConcern = {
    /**
     * requests acknowledgement that the write operation has
     * propagated to a specified number of mongod hosts
     * @default 1
     */
    w?: number | 'majority' | string,

    /**
     * requests acknowledgement from MongoDB that the write operation has
     * been written to the journal
     * @default false
     */
    j?: boolean,

    /**
     * a time limit, in milliseconds, for the write concern
     */
    wtimeout?: number,
  };
  /**
   * Options to pass when creating a Client Session
   * http://mongodb.github.io/node-mongodb-native/3.1/api/global.html#SessionOptions
   */
  declare export type SessionOptions = {
    /**
     * Whether causal consistency should be enabled on this session
     * @default true
     */
    causalConsistency?: boolean,

    /**
     * The default TransactionOptions to use for transactions started on this session.
     */
    defaultTransactionOptions?: TransactionOptions,
  };
  /**
   * Configuration options for a transaction.
   * http://mongodb.github.io/node-mongodb-native/3.1/api/global.html#TransactionOptions
   */
  declare export type TransactionOptions = {
    readConcern?: ReadConcern,
    writeConcern?: WriteConcern,
    readPreference?: ReadPreferenceOrMode,
  };
  declare export type MongoClientCommonOption = {
    /**
     * Do not make the db an event listener to the original connection.
     */
    noListener?: boolean,

    /**
     * Control if you want to return a cached instance or have a new one created
     */
    returnNonCachedInstance?: boolean,
  };
  declare export type MongoCallback<T> = (error?: ?MongoError, result: ?T) => void;

  declare export type WithTransactionCallback<T> = (session: ClientSession) => Promise<T>;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoError.html
   */
  declare export class MongoError extends Error {
    constructor(message: string): this;
    static create(options: { [key: string]: any }): MongoError;
    code?: number;

    /**
     * While not documented, the 'errmsg' prop is AFAIK the only way to find out
     * which unique index caused a duplicate key error. When you have multiple
     * unique indexes on a collection, knowing which index caused a duplicate
     * key error enables you to send better (more precise) error messages to the
     * client/user (eg. "Email address must be unique" instead of "Both email
     * address and username must be unique") - which caters for a better (app)
     * user experience.
     *
     * Details: https://github.com/Automattic/mongoose/issues/2129 (issue for
     * mongoose, but the same applies for the native mongodb driver)
     *
     * Note that in mongoose (the link above) the prop in question is called
     * 'message' while in mongodb it is called 'errmsg'. This can be seen in
     * multiple places in the source code, for example here:
     * https://github.com/mongodb/node-mongodb-native/blob/a12aa15ac3eaae3ad5c4166ea1423aec4560f155/test/functional/find_tests.js#L1111
     */
    errmsg?: string;
    name: string;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoNetworkError.html
   */
  declare export class MongoNetworkError extends MongoError {
    constructor(message: string): this;
    errorLabels: string[];
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoParseError.html
   */
  declare export class MongoParseError extends MongoError {
    constructor(message: string): this;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html#.connect
   */
  declare export type MongoClientOptions = {
    /**
     * The logging level (error/warn/info/debug)
     */
    loggerLevel?: string,

    /**
     * Custom logger object
     */
    logger?: { [key: string]: any } | log,

    /**
     * Validate MongoClient passed in options for correctness.
     * Default: false
     */
    validateOptions?: { [key: string]: any } | boolean,

    /**
     * The name of the application that created this MongoClient instance.
     */
    appname?: string,

    /**
     * Authentifikation credentials
     */
    auth?: {
      /**
       * The username for auth
       */
      user: string,

      /**
       * The password for auth
       */
      password: string,
      ...
    },

    /**
     * Determines whether or not to use the new url parser. Enables the new, spec-compliant
     * url parser shipped in the core driver. This url parser fixes a number of problems with
     * the original parser, and aims to outright replace that parser in the near future.
     */
    useNewUrlParser?: boolean,

    /**
     * Enables the new unified topology layer
     */
    useUnifiedTopology?: boolean,

    /**
     * number of retries for a tailable cursor
     * Default: 5
     */
    numberOfRetries?: number,

    /**
     * Mechanism for authentication: DEFAULT, GSSAPI, PLAIN, MONGODB-X509, 'MONGODB-CR', SCRAM-SHA-1 or SCRAM-SHA-256
     */
    authMechanism?:
      | 'DEFAULT'
      | 'GSSAPI'
      | 'PLAIN'
      | 'MONGODB-X509'
      | 'MONGODB-CR'
      | 'SCRAM-SHA-1'
      | 'SCRAM-SHA-256'
      | string,
    ...
  } & DbCreateOptions &
    ServerOptions &
    MongosOptions &
    ReplSetOptions &
    SocketOptions &
    SSLOptions &
    HighAvailabilityOptions &
    WriteConcern;
  declare export type SSLOptions = {
    /**
     * Passed directly through to tls.createSecureContext. See https://nodejs.org/dist/latest-v9.x/docs/api/tls.html#tls_tls_createsecurecontext_options for more info.
     */
    ciphers?: string,

    /**
     * Passed directly through to tls.createSecureContext. See https://nodejs.org/dist/latest-v9.x/docs/api/tls.html#tls_tls_createsecurecontext_options for more info.
     */
    ecdhCurve?: string,

    /**
     * Default:5; Number of connections for each server instance; set to 5 as default for legacy reasons.
     */
    poolSize?: number,

    /**
     * If present, the connection pool will be initialized with minSize connections, and will never dip below minSize connections
     */
    minSize?: number,

    /**
     * Use ssl connection (needs to have a mongod server with ssl support)
     */
    ssl?: boolean,

    /**
     * Default: true; Validate mongod server certificate against ca (mongod server >=2.4 with ssl support required)
     */
    sslValidate?: boolean,

    /**
     * Default: true; Server identity checking during SSL
     */
    checkServerIdentity?: boolean | typeof checkServerIdentity,

    /**
     * Array of valid certificates either as Buffers or Strings
     */
    sslCA?: $ReadOnlyArray<Buffer | string>,

    /**
     * SSL Certificate revocation list binary buffer
     */
    sslCRL?: $ReadOnlyArray<Buffer | string>,

    /**
     * SSL Certificate binary buffer
     */
    sslCert?: Buffer | string,

    /**
     * SSL Key file binary buffer
     */
    sslKey?: Buffer | string,

    /**
     * SSL Certificate pass phrase
     */
    sslPass?: Buffer | string,

    /**
     * String containing the server name requested via TLS SNI.
     */
    servername?: string,
  };
  declare export type HighAvailabilityOptions = {
    /**
     * Default: true; Turn on high availability monitoring.
     */
    ha?: boolean,

    /**
     * Default: 10000; The High availability period for replicaset inquiry
     */
    haInterval?: number,

    /**
     * Default: false;
     */
    domainsEnabled?: boolean,

    /**
     * The ReadPreference mode as listed here: http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
     */
    readPreference?: ReadPreferenceOrMode,

    /**
     * An object representing read preference tags, see: http://mongodb.github.io/node-mongodb-native/3.1/api/ReadPreference.html
     */
    readPreferenceTags?: string[],
  };
  declare export type ReadPreferenceMode =
    | 'primary'
    | 'primaryPreferred'
    | 'secondary'
    | 'secondaryPreferred'
    | 'nearest';
  declare export type ReadPreferenceOrMode = ReadPreference | ReadPreferenceMode;
  declare export class ReadPreference {
    constructor(mode: ReadPreferenceMode, tags: { [key: string]: any }): this;
    mode: ReadPreferenceMode;
    tags: any;
    options: {
      /**
       * Max Secondary Read Staleness in Seconds
       */
      maxStalenessSeconds?: number,
      ...
    };
    static PRIMARY: 'primary';
    static PRIMARY_PREFERRED: 'primaryPreferred';
    static SECONDARY: 'secondary';
    static SECONDARY_PREFERRED: 'secondaryPreferred';
    static NEAREST: 'nearest';
    isValid(mode: string): boolean;
    static isValid(mode: string): boolean;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html
   */
  declare export type DbCreateOptions = {
    /**
     * If the database authentication is dependent on another databaseName.
     */
    authSource?: string,

    /**
     * Default: false; Force server to create _id fields instead of client.
     */
    forceServerObjectId?: boolean,

    /**
     * Default: false; Use c++ bson parser.
     */
    native_parser?: boolean,

    /**
     * Serialize functions on any object.
     */
    serializeFunctions?: boolean,

    /**
     * Specify if the BSON serializer should ignore undefined fields.
     */
    ignoreUndefined?: boolean,

    /**
     * Return document results as raw BSON buffers.
     */
    raw?: boolean,

    /**
     * Default: true; Promotes Long values to number if they fit inside the 53 bits resolution.
     */
    promoteLongs?: boolean,

    /**
     * Default: false; Promotes Binary BSON values to native Node Buffers
     */
    promoteBuffers?: boolean,

    /**
     * the prefered read preference. use 'ReadPreference' class.
     */
    readPreference?: ReadPreferenceOrMode,

    /**
     * Default: true; Promotes BSON values to native types where possible, set to false to only receive wrapper types.
     */
    promoteValues?: boolean,

    /**
     * Custom primary key factory to generate _id values (see Custom primary keys).
     */
    pkFactory?: { [key: string]: any },

    /**
     * ES6 compatible promise constructor
     */
    promiseLibrary?: PromiseConstructor,

    /**
     * https://docs.mongodb.com/manual/reference/read-concern/#read-concern
     */
    readConcern?: ReadConcern | string,

    /**
     * Sets a cap on how many operations the driver will buffer up before giving up on getting a
     * working connection, default is -1 which is unlimited.
     */
    bufferMaxEntries?: number,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Server.html
   */
  declare export type SocketOptions = {
    /**
     * Reconnect on error. default:false
     */
    autoReconnect?: boolean,

    /**
     * TCP Socket NoDelay option. default:true
     */
    noDelay?: boolean,

    /**
     * TCP KeepAlive enabled on the socket. default:true
     */
    keepAlive?: boolean,

    /**
     * TCP KeepAlive initial delay before sending first keep-alive packet when idle. default:300000
     */
    keepAliveInitialDelay?: number,

    /**
     * TCP Connection timeout setting. default 0
     */
    connectTimeoutMS?: number,

    /**
     * Version of IP stack. Can be 4, 6 or null. default: null.
     *
     * If null, will attempt to connect with IPv6, and will fall back to IPv4 on failure
     * refer to http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
     */
    family?: 4 | 6 | null,

    /**
     * TCP Socket timeout setting. default 0
     */
    socketTimeoutMS?: number,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Server.html
   */
  declare export type ServerOptions = {
    /**
     * If you're connected to a single server or mongos proxy (as opposed to a replica set),
     * the MongoDB driver will try to reconnect every reconnectInterval milliseconds for reconnectTries
     * times, and give up afterward. When the driver gives up, the mongoose connection emits a
     * reconnectFailed event.
     * Default: 30
     */
    reconnectTries?: number,

    /**
     * Will wait # milliseconds between retries
     * Default: 1000;
     */
    reconnectInterval?: number,

    /**
     * Default: true;
     */
    monitoring?: boolean,

    /**
     * Enable command monitoring for this client
     * Default: false
     */
    monitorCommands?: boolean,

    /**
     * Socket Options
     */
    socketOptions?: SocketOptions,

    /**
     * Default: 10000; The High availability period for replicaset inquiry
     */
    haInterval?: number,

    /**
     * Default: false;
     */
    domainsEnabled?: boolean,

    /**
     * Specify a file sync write concern
     * Default: false
     */
    fsync?: boolean,
    ...
  } & SSLOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Mongos.html
   */
  declare export type MongosOptions = {
    /**
     * Default: 15; Cutoff latency point in MS for MongoS proxy selection
     */
    acceptableLatencyMS?: number,

    /**
     * Socket Options
     */
    socketOptions?: SocketOptions,
    ...
  } & SSLOptions &
    HighAvailabilityOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/ReplSet.html
   */
  declare export type ReplSetOptions = {
    /**
     * The max staleness to secondary reads (values under 10 seconds cannot be guaranteed);
     */
    maxStalenessSeconds?: number,

    /**
     * The name of the replicaset to connect to.
     */
    replicaSet?: string,

    /**
     * Default: 15 ; Range of servers to pick when using NEAREST (lowest ping ms + the latency fence, ex: range of 1 to (1 + 15) ms)
     */
    secondaryAcceptableLatencyMS?: number,
    connectWithNoPrimary?: boolean,
    socketOptions?: SocketOptions,
    ...
  } & SSLOptions &
    HighAvailabilityOptions;
  declare export type ProfilingLevel = 'off' | 'slow_only' | 'all';
  declare export class Db extends EventEmitter {
    constructor(
      databaseName: string,
      serverConfig: Server | ReplSet | Mongos,
      options?: DbCreateOptions,
    ): this;
    serverConfig: Server | ReplSet | Mongos;
    bufferMaxEntries: number;
    databaseName: string;
    options: any;
    native_parser: boolean;
    slaveOk: boolean;
    writeConcern: WriteConcern;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#addUser
     */
    addUser(username: string, password: string, callback: MongoCallback<any>): void;
    addUser(username: string, password: string, options?: DbAddUserOptions): Promise<any>;
    addUser(
      username: string,
      password: string,
      options: DbAddUserOptions,
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#admin
     */
    admin(): Admin;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#collection
     */
    collection<TSchema>(
      name: string,
      callback?: MongoCallback<Collection<TSchema>>,
    ): Collection<TSchema>;
    collection<TSchema>(
      name: string,
      options: DbCollectionOptions,
      callback?: MongoCallback<Collection<TSchema>>,
    ): Collection<TSchema>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#collections
     */
    collections(): Promise<Array<Collection<Default>>>;
    collections(callback: MongoCallback<Array<Collection<Default>>>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#command
     */
    command(command: { [key: string]: any }, callback: MongoCallback<any>): void;
    command(
      command: { [key: string]: any },
      options?: {
        readPreference: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
    ): Promise<any>;
    command(
      command: { [key: string]: any },
      options: {
        readPreference: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#createCollection
     */
    createCollection<TSchema>(name: string, callback: MongoCallback<Collection<TSchema>>): void;
    createCollection<TSchema>(
      name: string,
      options?: CollectionCreateOptions,
    ): Promise<Collection<TSchema>>;
    createCollection<TSchema>(
      name: string,
      options: CollectionCreateOptions,
      callback: MongoCallback<Collection<TSchema>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#createIndex
     */
    createIndex(
      name: string,
      fieldOrSpec: string | { [key: string]: any },
      callback: MongoCallback<any>,
    ): void;
    createIndex(
      name: string,
      fieldOrSpec: string | { [key: string]: any },
      options?: IndexOptions,
    ): Promise<any>;
    createIndex(
      name: string,
      fieldOrSpec: string | { [key: string]: any },
      options: IndexOptions,
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#dropCollection
     */
    dropCollection(name: string): Promise<boolean>;
    dropCollection(name: string, callback: MongoCallback<boolean>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#dropDatabase
     */
    dropDatabase(): Promise<any>;
    dropDatabase(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#executeDbAdminCommand
     */
    executeDbAdminCommand(command: { [key: string]: any }, callback: MongoCallback<any>): void;
    executeDbAdminCommand(
      command: { [key: string]: any },
      options?: {
        readPreference?: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
    ): Promise<any>;
    executeDbAdminCommand(
      command: { [key: string]: any },
      options: {
        readPreference?: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#indexInformation
     */
    indexInformation(name: string, callback: MongoCallback<any>): void;
    indexInformation(
      name: string,
      options?: {
        full?: boolean,
        readPreference?: ReadPreferenceOrMode,
        ...
      },
    ): Promise<any>;
    indexInformation(
      name: string,
      options: {
        full?: boolean,
        readPreference?: ReadPreferenceOrMode,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#listCollections
     */
    listCollections(
      filter?: { [key: string]: any },
      options?: {
        nameOnly?: boolean,
        batchSize?: number,
        readPreference?: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
    ): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#profilingInfo
     */
    /**
     * @deprecated Query the system.profile collection directly.
     */
    profilingInfo(callback: MongoCallback<any>): void;
    profilingInfo(options?: {
      session?: ClientSession,
      ...
    }): Promise<void>;
    profilingInfo(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<void>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#profilingLevel
     */
    profilingLevel(callback: MongoCallback<ProfilingLevel>): void;
    profilingLevel(options?: {
      session?: ClientSession,
      ...
    }): Promise<ProfilingLevel>;
    profilingLevel(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<ProfilingLevel>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#removeUser
     */
    removeUser(username: string, callback: MongoCallback<any>): void;
    removeUser(username: string, options?: CommonOptions): Promise<any>;
    removeUser(username: string, options: CommonOptions, callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#renameCollection
     */
    renameCollection<TSchema>(
      fromCollection: string,
      toCollection: string,
      callback: MongoCallback<Collection<TSchema>>,
    ): void;
    renameCollection<TSchema>(
      fromCollection: string,
      toCollection: string,
      options?: {
        dropTarget?: boolean,
        ...
      },
    ): Promise<Collection<TSchema>>;
    renameCollection<TSchema>(
      fromCollection: string,
      toCollection: string,
      options: {
        dropTarget?: boolean,
        ...
      },
      callback: MongoCallback<Collection<TSchema>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#setProfilingLevel
     */
    setProfilingLevel(level: ProfilingLevel, callback: MongoCallback<ProfilingLevel>): void;
    setProfilingLevel(
      level: ProfilingLevel,
      options?: {
        session?: ClientSession,
        ...
      },
    ): Promise<ProfilingLevel>;
    setProfilingLevel(
      level: ProfilingLevel,
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<ProfilingLevel>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#stats
     */
    stats(callback: MongoCallback<any>): void;
    stats(options?: {
      scale?: number,
      ...
    }): Promise<any>;
    stats(
      options: {
        scale?: number,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.3/api/Db.html#watch
     */
    watch(
      pipeline?: { [key: string]: any }[],
      options?: ChangeStreamOptions & {
        session?: ClientSession,
        ...
      },
    ): ChangeStream;
  }
  declare export type CommonOptions = {
    session?: ClientSession,
    ...
  } & WriteConcern;

  /**
   * @deprecated
   * @see http://mongodb.github.io/node-mongodb-native/3.1/api/Server.html
   */
  declare export class Server extends EventEmitter {
    constructor(host: string, port: number, options?: ServerOptions): this;
    connections(): any[];
  }
  /**
   * @deprecated
   * @see http://mongodb.github.io/node-mongodb-native/3.1/api/ReplSet.html
   */
  declare export class ReplSet extends EventEmitter {
    constructor(servers: Server[], options?: ReplSetOptions): this;
    connections(): any[];
  }
  /**
   * @deprecated
   * @see http://mongodb.github.io/node-mongodb-native/3.1/api/Mongos.html
   */
  declare export class Mongos extends EventEmitter {
    constructor(servers: Server[], options?: MongosOptions): this;
    connections(): any[];
  }
  /**
   * @deprecated
   * @see http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#addUser
   */
  declare export type DbAddUserOptions = {
    customData?: { [key: string]: any },
    roles?: { [key: string]: any }[],
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#createCollection
   */
  declare export type CollectionCreateOptions = {
    raw?: boolean,
    pkFactory?: { [key: string]: any },
    readPreference?: ReadPreferenceOrMode,
    serializeFunctions?: boolean,
    strict?: boolean,
    capped?: boolean,
    autoIndexId?: boolean,
    size?: number,
    max?: number,
    flags?: number,
    storageEngine?: { [key: string]: any },
    validator?: { [key: string]: any },
    validationLevel?: 'off' | 'strict' | 'moderate',
    validationAction?: 'error' | 'warn',
    indexOptionDefaults?: { [key: string]: any },
    viewOn?: string,
    pipeline?: any[],
    collation?: CollationDocument,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#collection
   */
  declare export type DbCollectionOptions = {
    raw?: boolean,
    pkFactory?: { [key: string]: any },
    readPreference?: ReadPreferenceOrMode,
    serializeFunctions?: boolean,
    strict?: boolean,
    readConcern?: ReadConcern,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html#createIndex
   */
  declare export type IndexOptions = {
    /**
     * Creates an unique index.
     */
    unique?: boolean,

    /**
     * Creates a sparse index.
     */
    sparse?: boolean,

    /**
     * Creates the index in the background, yielding whenever possible.
     */
    background?: boolean,

    /**
     * A unique index cannot be created on a key that has pre-existing duplicate values.
     *
     * If you would like to create the index anyway, keeping the first document the database indexes and
     * deleting all subsequent documents that have duplicate value
     */
    dropDups?: boolean,

    /**
     * For geo spatial indexes set the lower bound for the co-ordinates.
     */
    min?: number,

    /**
     * For geo spatial indexes set the high bound for the co-ordinates.
     */
    max?: number,

    /**
     * Specify the format version of the indexes.
     */
    v?: number,

    /**
     * Allows you to expire data on indexes applied to a data (MongoDB 2.2 or higher)
     */
    expireAfterSeconds?: number,

    /**
     * Override the auto generated index name (useful if the resulting name is larger than 128 bytes)
     */
    name?: string,

    /**
     * Creates a partial index based on the given filter object (MongoDB 3.2 or higher)
     */
    partialFilterExpression?: any,
    collation?: CollationDocument,
    default_language?: string,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html
   */
  declare export class Admin {
    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#addUser
     */
    addUser(username: string, password: string, callback: MongoCallback<any>): void;
    addUser(username: string, password: string, options?: AddUserOptions): Promise<any>;
    addUser(
      username: string,
      password: string,
      options: AddUserOptions,
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#buildInfo
     */
    buildInfo(options?: {
      session?: ClientSession,
      ...
    }): Promise<any>;
    buildInfo(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;
    buildInfo(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#command
     */
    command(command: { [key: string]: any }, callback: MongoCallback<any>): void;
    command(
      command: { [key: string]: any },
      options?: {
        readPreference?: ReadPreferenceOrMode,
        maxTimeMS?: number,
        ...
      },
    ): Promise<any>;
    command(
      command: { [key: string]: any },
      options: {
        readPreference?: ReadPreferenceOrMode,
        maxTimeMS?: number,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#listDatabases
     */
    listDatabases(options?: {
      nameOnly?: boolean,
      session?: ClientSession,
      ...
    }): Promise<any>;
    listDatabases(
      options: {
        nameOnly?: boolean,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;
    listDatabases(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#ping
     */
    ping(options?: {
      session?: ClientSession,
      ...
    }): Promise<any>;
    ping(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;
    ping(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#removeUser
     */
    removeUser(username: string, callback: MongoCallback<any>): void;
    removeUser(username: string, options?: FSyncOptions): Promise<any>;
    removeUser(username: string, options: FSyncOptions, callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#replSetGetStatus
     */
    replSetGetStatus(options?: {
      session?: ClientSession,
      ...
    }): Promise<any>;
    replSetGetStatus(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;
    replSetGetStatus(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#serverInfo
     */
    serverInfo(): Promise<any>;
    serverInfo(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#serverStatus
     */
    serverStatus(options?: {
      session?: ClientSession,
      ...
    }): Promise<any>;
    serverStatus(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;
    serverStatus(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#validateCollection
     */
    validateCollection(collectionNme: string, callback: MongoCallback<any>): void;
    validateCollection(collectionNme: string, options?: { [key: string]: any }): Promise<any>;
    validateCollection(
      collectionNme: string,
      options: { [key: string]: any },
      callback: MongoCallback<any>,
    ): void;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#addUser
   */
  declare export type AddUserOptions = {
    fsync: boolean,
    customData?: { [key: string]: any },
    roles?: { [key: string]: any }[],
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Admin.html#removeUser
   */
  declare export type FSyncOptions = {
    fsync?: boolean,
    ...
  } & CommonOptions;
  declare type EnhancedOmit<
    T,
    K,
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  declare type ExtractIdType<
    TSchema,
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  declare type OptionalId<
    TSchema: {
      _id?: any,
      ...
    },
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  declare type WithId<TSchema> = EnhancedOmit<TSchema, '_id'> & {
    _id: ExtractIdType<TSchema>,
    ...
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html
   */
  declare export class Collection<
    TSchema: {
      [key: string]: any,
      ...,
    } = DefaultSchema,
  > {
    /**
     * Get the collection name.
     */
    collectionName: string;

    /**
     * Get the full collection namespace.
     */
    namespace: string;

    /**
     * The current write concern values.
     */
    writeConcern: WriteConcern;

    /**
     * The current read concern values.
     */
    readConcern: ReadConcern;

    /**
     * Get current index hint for collection.
     */
    hint: any;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html#aggregate
     */
    aggregate<T>(callback: MongoCallback<AggregationCursor<T>>): AggregationCursor<T>;
    aggregate<T>(
      pipeline: { [key: string]: any }[],
      callback: MongoCallback<AggregationCursor<T>>,
    ): AggregationCursor<T>;
    aggregate<T>(
      pipeline?: { [key: string]: any }[],
      options?: CollectionAggregationOptions,
      callback?: MongoCallback<AggregationCursor<T>>,
    ): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html#bulkWrite
     */
    bulkWrite(
      operations: { [key: string]: any }[],
      callback: MongoCallback<BulkWriteOpResultObject>,
    ): void;
    bulkWrite(
      operations: { [key: string]: any }[],
      options?: CollectionBulkWriteOptions,
    ): Promise<BulkWriteOpResultObject>;
    bulkWrite(
      operations: { [key: string]: any }[],
      options: CollectionBulkWriteOptions,
      callback: MongoCallback<BulkWriteOpResultObject>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#count
     * @deprecated Use countDocuments or estimatedDocumentCount
     */
    count(callback: MongoCallback<number>): void;
    count(query: FilterQuery<TSchema>, callback: MongoCallback<number>): void;
    count(query?: FilterQuery<TSchema>, options?: MongoCountPreferences): Promise<number>;
    count(
      query: FilterQuery<TSchema>,
      options: MongoCountPreferences,
      callback: MongoCallback<number>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
     */
    countDocuments(callback: MongoCallback<number>): void;
    countDocuments(query: FilterQuery<TSchema>, callback: MongoCallback<number>): void;
    countDocuments(query?: FilterQuery<TSchema>, options?: MongoCountPreferences): Promise<number>;
    countDocuments(
      query: FilterQuery<TSchema>,
      options: MongoCountPreferences,
      callback: MongoCallback<number>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#createIndex
     */
    createIndex(fieldOrSpec: string | any, callback: MongoCallback<string>): void;
    createIndex(fieldOrSpec: string | any, options?: IndexOptions): Promise<string>;
    createIndex(
      fieldOrSpec: string | any,
      options: IndexOptions,
      callback: MongoCallback<string>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#createIndexes and  http://docs.mongodb.org/manual/reference/command/createIndexes/
     */
    createIndexes(indexSpecs: IndexSpecification[], callback: MongoCallback<any>): void;
    createIndexes(
      indexSpecs: IndexSpecification[],
      options?: {
        session?: ClientSession,
        ...
      },
    ): Promise<any>;
    createIndexes(
      indexSpecs: IndexSpecification[],
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteMany
     */
    deleteMany(
      filter: FilterQuery<TSchema>,
      callback: MongoCallback<DeleteWriteOpResultObject>,
    ): void;
    deleteMany(
      filter: FilterQuery<TSchema>,
      options?: CommonOptions,
    ): Promise<DeleteWriteOpResultObject>;
    deleteMany(
      filter: FilterQuery<TSchema>,
      options: CommonOptions,
      callback: MongoCallback<DeleteWriteOpResultObject>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteOne
     */
    deleteOne(
      filter: FilterQuery<TSchema>,
      callback: MongoCallback<DeleteWriteOpResultObject>,
    ): void;
    deleteOne(
      filter: FilterQuery<TSchema>,
      options?: CommonOptions & {
        bypassDocumentValidation?: boolean,
        ...
      },
    ): Promise<DeleteWriteOpResultObject>;
    deleteOne(
      filter: FilterQuery<TSchema>,
      options: CommonOptions & {
        bypassDocumentValidation?: boolean,
        ...
      },
      callback: MongoCallback<DeleteWriteOpResultObject>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#distinct
     */
    distinct(key: string, callback: MongoCallback<any>): void;
    distinct(key: string, query: FilterQuery<TSchema>, callback: MongoCallback<any>): void;
    distinct(
      key: string,
      query?: FilterQuery<TSchema>,
      options?: {
        readPreference?: ReadPreferenceOrMode,
        maxTimeMS?: number,
        session?: ClientSession,
        ...
      },
    ): Promise<any>;
    distinct(
      key: string,
      query: FilterQuery<TSchema>,
      options: {
        readPreference?: ReadPreferenceOrMode,
        maxTimeMS?: number,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#drop
     */
    drop(options?: {
      session: ClientSession,
      ...
    }): Promise<any>;
    drop(callback: MongoCallback<any>): void;
    drop(
      options: {
        session: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#dropIndex
     */
    dropIndex(indexName: string, callback: MongoCallback<any>): void;
    dropIndex(
      indexName: string,
      options?: CommonOptions & {
        maxTimeMS?: number,
        ...
      },
    ): Promise<any>;
    dropIndex(
      indexName: string,
      options: CommonOptions & {
        maxTimeMS?: number,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#dropIndexes
     */
    dropIndexes(options?: {
      session?: ClientSession,
      maxTimeMS?: number,
      ...
    }): Promise<any>;
    dropIndexes(callback?: MongoCallback<any>): void;
    dropIndexes(
      options: {
        session?: ClientSession,
        maxTimeMS?: number,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
     */
    estimatedDocumentCount(callback: MongoCallback<number>): void;
    estimatedDocumentCount(query: FilterQuery<TSchema>, callback: MongoCallback<number>): void;
    estimatedDocumentCount(
      query?: FilterQuery<TSchema>,
      options?: MongoCountPreferences,
    ): Promise<number>;
    estimatedDocumentCount(
      query: FilterQuery<TSchema>,
      options: MongoCountPreferences,
      callback: MongoCallback<number>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
     */
    find<T>(): Cursor<T>;
    find<T>(query?: FilterQuery<TSchema>, options?: FindOneOptions): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOne
     */
    findOne<T>(filter: FilterQuery<TSchema>, callback: MongoCallback<T | null>): void;
    findOne<T>(filter: FilterQuery<TSchema>, options?: FindOneOptions): Promise<T | null>;
    findOne<T>(
      filter: FilterQuery<TSchema>,
      options: FindOneOptions,
      callback: MongoCallback<T | null>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndDelete
     */
    findOneAndDelete(
      filter: FilterQuery<TSchema>,
      callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    findOneAndDelete(
      filter: FilterQuery<TSchema>,
      options?: FindOneAndDeleteOption,
    ): Promise<FindAndModifyWriteOpResultObject<TSchema>>;
    findOneAndDelete(
      filter: FilterQuery<TSchema>,
      options: FindOneAndDeleteOption,
      callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndReplace
     */
    findOneAndReplace(
      filter: FilterQuery<TSchema>,
      replacement: { [key: string]: any },
      callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    findOneAndReplace(
      filter: FilterQuery<TSchema>,
      replacement: { [key: string]: any },
      options?: FindOneAndReplaceOption,
    ): Promise<FindAndModifyWriteOpResultObject<TSchema>>;
    findOneAndReplace(
      filter: FilterQuery<TSchema>,
      replacement: { [key: string]: any },
      options: FindOneAndReplaceOption,
      callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndUpdate
     */
    findOneAndUpdate(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | TSchema,
      callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;
    findOneAndUpdate(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | TSchema,
      options?: FindOneAndUpdateOption,
    ): Promise<FindAndModifyWriteOpResultObject<TSchema>>;
    findOneAndUpdate(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | TSchema,
      options: FindOneAndUpdateOption,
      callback: MongoCallback<FindAndModifyWriteOpResultObject<TSchema>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#geoHaystackSearch
     */
    geoHaystackSearch(x: number, y: number, callback: MongoCallback<any>): void;
    geoHaystackSearch(x: number, y: number, options?: GeoHaystackSearchOptions): Promise<any>;
    geoHaystackSearch(
      x: number,
      y: number,
      options: GeoHaystackSearchOptions,
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#group
     */
    /**
     * @deprecated MongoDB 3.6 or higher no longer supports the group command. We recommend rewriting using the aggregation framework.
     */
    group(
      keys: { [key: string]: any } | any[] | Function | Code,
      condition: { [key: string]: any },
      initial: { [key: string]: any },
      reduce: Function | Code,
      finalize: Function | Code,
      command: boolean,
      callback: MongoCallback<any>,
    ): void;

    /**
     * @deprecated MongoDB 3.6 or higher no longer supports the group command. We recommend rewriting using the aggregation framework.
     */
    group(
      keys: { [key: string]: any } | any[] | Function | Code,
      condition: { [key: string]: any },
      initial: { [key: string]: any },
      reduce: Function | Code,
      finalize: Function | Code,
      command: boolean,
      options?: {
        readPreference?: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
    ): Promise<any>;

    /**
     * @deprecated MongoDB 3.6 or higher no longer supports the group command. We recommend rewriting using the aggregation framework.
     */
    group(
      keys: { [key: string]: any } | any[] | Function | Code,
      condition: { [key: string]: any },
      initial: { [key: string]: any },
      reduce: Function | Code,
      finalize: Function | Code,
      command: boolean,
      options: {
        readPreference?: ReadPreferenceOrMode,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#indexes
     */
    indexes(options?: {
      session: ClientSession,
      ...
    }): Promise<any>;
    indexes(callback: MongoCallback<any>): void;
    indexes(
      options: {
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#indexExists
     */
    indexExists(indexes: string | string[], callback: MongoCallback<boolean>): void;
    indexExists(
      indexes: string | string[],
      options?: {
        session: ClientSession,
        ...
      },
    ): Promise<boolean>;
    indexExists(
      indexes: string | string[],
      options: {
        session: ClientSession,
        ...
      },
      callback: MongoCallback<boolean>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#indexInformation
     */
    indexInformation(callback: MongoCallback<any>): void;
    indexInformation(options?: {
      full: boolean,
      session: ClientSession,
      ...
    }): Promise<any>;
    indexInformation(
      options: {
        full: boolean,
        session: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#initializeOrderedBulkOp
     */
    initializeOrderedBulkOp(options?: CommonOptions): OrderedBulkOperation;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#initializeUnorderedBulkOp
     */
    initializeUnorderedBulkOp(options?: CommonOptions): UnorderedBulkOperation;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne
     */
    /**
     * @deprecated Use insertOne, insertMany or bulkWrite
     */
    insert(
      docs: OptionalId<TSchema>,
      callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>,
    ): void;

    /**
     * @deprecated Use insertOne, insertMany or bulkWrite
     */
    insert(
      docs: OptionalId<TSchema>,
      options?: CollectionInsertOneOptions,
    ): Promise<InsertWriteOpResult<WithId<TSchema>>>;

    /**
     * @deprecated Use insertOne, insertMany or bulkWrite
     */
    insert(
      docs: OptionalId<TSchema>,
      options: CollectionInsertOneOptions,
      callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertMany
     */
    insertMany(
      docs: Array<OptionalId<TSchema>>,
      callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>,
    ): void;
    insertMany(
      docs: Array<OptionalId<TSchema>>,
      options?: CollectionInsertManyOptions,
    ): Promise<InsertWriteOpResult<WithId<TSchema>>>;
    insertMany(
      docs: Array<OptionalId<TSchema>>,
      options: CollectionInsertManyOptions,
      callback: MongoCallback<InsertWriteOpResult<WithId<TSchema>>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne
     */
    insertOne(
      docs: OptionalId<TSchema>,
      callback: MongoCallback<InsertOneWriteOpResult<WithId<TSchema>>>,
    ): void;
    insertOne(
      docs: OptionalId<TSchema>,
      options?: CollectionInsertOneOptions,
    ): Promise<InsertOneWriteOpResult<WithId<TSchema>>>;
    insertOne(
      docs: OptionalId<TSchema>,
      options: CollectionInsertOneOptions,
      callback: MongoCallback<InsertOneWriteOpResult<WithId<TSchema>>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#isCapped
     */
    isCapped(options?: {
      session: ClientSession,
      ...
    }): Promise<any>;
    isCapped(callback: MongoCallback<any>): void;
    isCapped(
      options: {
        session: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#listIndexes
     */
    listIndexes(options?: {
      batchSize?: number,
      readPreference?: ReadPreferenceOrMode,
      session?: ClientSession,
      ...
    }): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#mapReduce
     */
    mapReduce<TKey, TValue>(
      map: CollectionMapFunction<TSchema> | string,
      reduce: CollectionReduceFunction<TKey, TValue> | string,
      callback: MongoCallback<any>,
    ): void;
    mapReduce<TKey, TValue>(
      map: CollectionMapFunction<TSchema> | string,
      reduce: CollectionReduceFunction<TKey, TValue> | string,
      options?: MapReduceOptions,
    ): Promise<any>;
    mapReduce<TKey, TValue>(
      map: CollectionMapFunction<TSchema> | string,
      reduce: CollectionReduceFunction<TKey, TValue> | string,
      options: MapReduceOptions,
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#options
     */
    options(options?: {
      session: ClientSession,
      ...
    }): Promise<any>;
    options(callback: MongoCallback<any>): void;
    options(
      options: {
        session: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#parallelCollectionScan
     */
    parallelCollectionScan(callback: MongoCallback<Array<Cursor<any>>>): void;
    parallelCollectionScan(options?: ParallelCollectionScanOptions): Promise<Array<Cursor<any>>>;
    parallelCollectionScan(
      options: ParallelCollectionScanOptions,
      callback: MongoCallback<Array<Cursor<any>>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#reIndex
     */
    reIndex(options?: {
      session: ClientSession,
      ...
    }): Promise<any>;
    reIndex(callback: MongoCallback<any>): void;
    reIndex(
      options: {
        session: ClientSession,
        ...
      },
      callback: MongoCallback<any>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#remove
     */
    /**
     * @deprecated Use use deleteOne, deleteMany or bulkWrite
     */
    remove(selector: { [key: string]: any }, callback: MongoCallback<WriteOpResult>): void;

    /**
     * @deprecated Use use deleteOne, deleteMany or bulkWrite
     */
    remove(
      selector: { [key: string]: any },
      options?: CommonOptions & {
        single?: boolean,
        ...
      },
    ): Promise<WriteOpResult>;

    /**
     * @deprecated Use use deleteOne, deleteMany or bulkWrite
     */
    remove(
      selector: { [key: string]: any },
      options?: CommonOptions & {
        single?: boolean,
        ...
      },
      callback?: MongoCallback<WriteOpResult>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#rename
     */
    rename(newName: string, callback: MongoCallback<Collection<TSchema>>): void;
    rename(
      newName: string,
      options?: {
        dropTarget?: boolean,
        session?: ClientSession,
        ...
      },
    ): Promise<Collection<TSchema>>;
    rename(
      newName: string,
      options: {
        dropTarget?: boolean,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<Collection<TSchema>>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#replaceOne
     */
    replaceOne(
      filter: FilterQuery<TSchema>,
      doc: TSchema,
      callback: MongoCallback<ReplaceWriteOpResult>,
    ): void;
    replaceOne(
      filter: FilterQuery<TSchema>,
      doc: TSchema,
      options?: ReplaceOneOptions,
    ): Promise<ReplaceWriteOpResult>;
    replaceOne(
      filter: FilterQuery<TSchema>,
      doc: TSchema,
      options: ReplaceOneOptions,
      callback: MongoCallback<ReplaceWriteOpResult>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#save
     */
    /**
     * @deprecated Use insertOne, insertMany, updateOne or updateMany
     */
    save(doc: TSchema, callback: MongoCallback<WriteOpResult>): void;

    /**
     * @deprecated Use insertOne, insertMany, updateOne or updateMany
     */
    save(doc: TSchema, options?: CommonOptions): Promise<WriteOpResult>;

    /**
     * @deprecated Use insertOne, insertMany, updateOne or updateMany
     */
    save(doc: TSchema, options: CommonOptions, callback: MongoCallback<WriteOpResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#stats
     */
    stats(callback: MongoCallback<CollStats>): void;
    stats(options?: {
      scale: number,
      session?: ClientSession,
      ...
    }): Promise<CollStats>;
    stats(
      options: {
        scale: number,
        session?: ClientSession,
        ...
      },
      callback: MongoCallback<CollStats>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#update
     */
    /**
     * @deprecated use updateOne, updateMany or bulkWrite
     */
    update(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      callback: MongoCallback<WriteOpResult>,
    ): void;

    /**
     * @deprecated use updateOne, updateMany or bulkWrite
     */
    update(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      options?: UpdateOneOptions & {
        multi?: boolean,
        ...
      },
    ): Promise<WriteOpResult>;

    /**
     * @deprecated use updateOne, updateMany or bulkWrite
     */
    update(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      options: UpdateOneOptions & {
        multi?: boolean,
        ...
      },
      callback: MongoCallback<WriteOpResult>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateMany
     */
    updateMany(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      callback: MongoCallback<UpdateWriteOpResult>,
    ): void;
    updateMany(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      options?: UpdateManyOptions,
    ): Promise<UpdateWriteOpResult>;
    updateMany(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      options: UpdateManyOptions,
      callback: MongoCallback<UpdateWriteOpResult>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateOne
     */
    updateOne(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      callback: MongoCallback<UpdateWriteOpResult>,
    ): void;
    updateOne(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      options?: UpdateOneOptions,
    ): Promise<UpdateWriteOpResult>;
    updateOne(
      filter: FilterQuery<TSchema>,
      update: UpdateQuery<TSchema> | $Rest<TSchema, { ... }>,
      options: UpdateOneOptions,
      callback: MongoCallback<UpdateWriteOpResult>,
    ): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#watch
     */
    watch(
      pipeline?: { [key: string]: any }[],
      options?: ChangeStreamOptions & {
        session?: ClientSession,
        ...
      },
    ): ChangeStream;
  }
  /**
   * Update Query
   */
  declare type KeysOfAType<TSchema, Type> = $ElementType<
    $ObjMapi<
      TSchema,
      <key>(key) => /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    >,
    $Keys<TSchema>,
  >;
  declare type KeysOfOtherType<TSchema, Type> = $ElementType<
    $ObjMapi<
      TSchema,
      <key>(key) => /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    >,
    $Keys<TSchema>,
  >;
  declare type AcceptedFields<TSchema, FieldType, AssignableType> = $ObjMapi<
    { [k: KeysOfAType<TSchema, FieldType>]: any },
    <key>(key) => AssignableType,
  >;
  /**
   * It avoid uses fields of non Type
   */
  declare type NotAcceptedFields<TSchema, FieldType> = $ObjMapi<
    { [k: KeysOfOtherType<TSchema, FieldType>]: any },
    <key>(key) => empty,
  >;
  declare type DotAndArrayNotation<AssignableType> = {
    [key: string]: AssignableType,
    ...,
  };
  declare type ReadonlyPartial<TSchema> = $ObjMapi<
    TSchema,
    <key>(key) => $ElementType<TSchema, key>,
  >;
  declare export type OnlyFieldsOfType<
    TSchema,
    FieldType = any,
    AssignableType = FieldType,
  > = AcceptedFields<TSchema, FieldType, AssignableType> &
    NotAcceptedFields<TSchema, FieldType> &
    DotAndArrayNotation<AssignableType>;
  declare export type MatchKeysAndValues<TSchema> = ReadonlyPartial<TSchema> &
    DotAndArrayNotation<any>;
  declare type Unpacked<
    Type,
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  declare export type SortValues = -1 | 1;
  declare export type AddToSetOperators<Type> = {
    $each: Type,
    ...
  };
  declare export type ArrayOperator<Type> = {
    $each: Type,
    $slice?: number,
    $position?: number,
    $sort?: SortValues | { [key: string]: SortValues, ... },
    ...
  };
  declare export type SetFields<TSchema> = ($ObjMapi<
    { [k: KeysOfAType<TSchema, any[]>]: any },
    <key>(
      key,
    ) => Unpacked<$ElementType<TSchema, key>> | AddToSetOperators<$ElementType<TSchema, key>>,
  > &
    NotAcceptedFields<TSchema, any[]>) & {
    [key: string]: AddToSetOperators<any> | any,
    ...,
  };
  declare export type PushOperator<TSchema> = ($ObjMapi<
    { [k: KeysOfAType<TSchema, any[]>]: any },
    <key>(key) => Unpacked<$ElementType<TSchema, key>> | ArrayOperator<$ElementType<TSchema, key>>,
  > &
    NotAcceptedFields<TSchema, any[]>) & {
    [key: string]: ArrayOperator<any> | any,
    ...,
  };
  declare export type PullOperator<TSchema> = ($ObjMapi<
    { [k: KeysOfAType<TSchema, any[]>]: any },
    <key>(
      key,
    ) =>
      | $Rest<Unpacked<$ElementType<TSchema, key>>, { ... }>
      | ObjectQuerySelector<Unpacked<$ElementType<TSchema, key>>>,
  > &
    NotAcceptedFields<TSchema, any[]>) & {
    [key: string]: QuerySelector<any> | any,
    ...,
  };
  declare export type PullAllOperator<TSchema> = ($ObjMapi<
    { [k: KeysOfAType<TSchema, any[]>]: any },
    <key>(key) => $ElementType<TSchema, key>,
  > &
    NotAcceptedFields<TSchema, any[]>) & {
    [key: string]: any[],
    ...,
  };
  /**
   * https://docs.mongodb.com/manual/reference/operator/update
   */
  declare export type UpdateQuery<TSchema> = {
    /**
     * https://docs.mongodb.com/manual/reference/operator/update-field/
     */
    $currentDate?: OnlyFieldsOfType<
      TSchema,
      Date,
      | true
      | {
          $type: 'date' | 'timestamp',
          ...
        },
    >,
    $inc?: OnlyFieldsOfType<TSchema, number>,
    $min?: MatchKeysAndValues<TSchema>,
    $max?: MatchKeysAndValues<TSchema>,
    $mul?: OnlyFieldsOfType<TSchema, number>,
    $rename?: {
      [key: string]: string,
      ...,
    },
    $set?: MatchKeysAndValues<TSchema>,
    $setOnInsert?: MatchKeysAndValues<TSchema>,
    $unset?: OnlyFieldsOfType<TSchema, any, ''>,

    /**
     * https://docs.mongodb.com/manual/reference/operator/update-array/
     */
    $addToSet?: SetFields<TSchema>,
    $pop?: OnlyFieldsOfType<TSchema, any[], 1 | -1>,
    $pull?: PullOperator<TSchema>,
    $push?: PushOperator<TSchema>,
    $pullAll?: PullAllOperator<TSchema>,

    /**
     * https://docs.mongodb.com/manual/reference/operator/update-bitwise/
     */
    $bit?: {
      [key: string]: $ObjMapi<{ [k: 'and' | 'or' | 'xor']: any }, <key>(key) => number>,
      ...,
    },
    ...
  };
  /**
   * https://docs.mongodb.com/manual/reference/operator/query/type/#available-types
   */

  declare export var BSONType: {|
    +Double: 1, // 1
    +String: 1, // 1
    +Object: 2, // 2
    +Array: 3, // 3
    +BinData: 4, // 4
    +Undefined: 5, // 5
    +ObjectId: 6, // 6
    +Boolean: 7, // 7
    +Date: 8, // 8
    +Null: 9, // 9
    +Regex: 10, // 10
    +DBPointer: 11, // 11
    +JavaScript: 12, // 12
    +Symbol: 13, // 13
    +JavaScriptWithScope: 14, // 14
    +Int: 15, // 15
    +Timestamp: 16, // 16
    +Long: 17, // 17
    +Decimal: 18, // 18
    +MinKey: -1, // -1
    +MaxKey: 127, // 127
  |};
  declare type BSONTypeAlias =
    | 'number'
    | 'double'
    | 'string'
    | 'object'
    | 'array'
    | 'binData'
    | 'undefined'
    | 'objectId'
    | 'bool'
    | 'date'
    | 'null'
    | 'regex'
    | 'dbPointer'
    | 'javascript'
    | 'symbol'
    | 'javascriptWithScope'
    | 'int'
    | 'timestamp'
    | 'long'
    | 'decimal'
    | 'minKey'
    | 'maxKey';
  /**
   * https://docs.mongodb.com/manual/reference/operator/query-bitwise
   */
  declare type BitwiseQuery = number | Binary | number[];
  declare type RegExpForString<
    T,
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  declare type MongoAltQuery<
    T,
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  /**
   * https://docs.mongodb.com/manual/reference/operator/query/#query-selectors
   */
  declare export type QuerySelector<T> = {
    $eq?: T,
    $gt?: T,
    $gte?: T,
    $in?: T[],
    $lt?: T,
    $lte?: T,
    $ne?: T,
    $nin?: T[],
    $not?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,

    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean,
    $type?: $Values<typeof BSONType> | BSONTypeAlias,
    $expr?: any,
    $jsonSchema?: any,
    $mod?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    $regex?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    $options?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    $geoIntersects?: {
      $geometry: { [key: string]: any },
      ...
    },
    $geoWithin?: { [key: string]: any },
    $near?: { [key: string]: any },
    $nearSphere?: { [key: string]: any },
    $maxDistance?: number,
    $all?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    $elemMatch?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    $size?: /* Flow doesn't support conditional types, use `$Call` utility type */ any,
    $bitsAllClear?: BitwiseQuery,
    $bitsAllSet?: BitwiseQuery,
    $bitsAnyClear?: BitwiseQuery,
    $bitsAnySet?: BitwiseQuery,
    ...
  };
  declare export type RootQuerySelector<T> = {
    /**
     * https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and
     */
    $and?: Array<FilterQuery<T>>,

    /**
     * https://docs.mongodb.com/manual/reference/operator/query/nor/#op._S_nor
     */
    $nor?: Array<FilterQuery<T>>,

    /**
     * https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or
     */
    $or?: Array<FilterQuery<T>>,

    /**
     * https://docs.mongodb.com/manual/reference/operator/query/text
     */
    $text?: {
      $search: string,
      $language?: string,
      $caseSensitive?: boolean,
      $diacraticSensitive?: boolean,
      ...
    },

    /**
     * https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where
     */
    $where?: string | Function,

    /**
     * https://docs.mongodb.com/manual/reference/operator/query/comment/#op._S_comment
     */
    $comment?: string,
    [key: string]: any,
    ...
  };
  declare export type ObjectQuerySelector<
    T,
  > = /* Flow doesn't support conditional types, use `$Call` utility type */ any;
  declare export type Condition<T> = MongoAltQuery<T> | QuerySelector<MongoAltQuery<T>>;
  declare export type FilterQuery<T> = $ObjMapi<T, <P>(P) => Condition<$ElementType<T, P>>> &
    RootQuerySelector<T>;
  /**
   * http://docs.mongodb.org/manual/reference/command/collStats/
   */
  declare export type CollStats = {
    /**
     * Namespace.
     */
    ns: string,

    /**
     * Number of documents.
     */
    count: number,

    /**
     * Collection size in bytes.
     */
    size: number,

    /**
     * Average object size in bytes.
     */
    avgObjSize: number,

    /**
     * (Pre)allocated space for the collection in bytes.
     */
    storageSize: number,

    /**
     * Number of extents (contiguously allocated chunks of datafile space).
     */
    numExtents: number,

    /**
     * Number of indexes.
     */
    nindexes: number,

    /**
     * Size of the most recently created extent in bytes.
     */
    lastExtentSize: number,

    /**
     * Padding can speed up updates if documents grow.
     */
    paddingFactor: number,

    /**
     * A number that indicates the user-set flags on the collection. userFlags only appears when using the mmapv1 storage engine.
     */
    userFlags?: number,

    /**
     * Total index size in bytes.
     */
    totalIndexSize: number,

    /**
     * Size of specific indexes in bytes.
     */
    indexSizes: {
      _id_: number,
      [index: string]: number,
      ...
    },

    /**
     * `true` if the collection is capped.
     */
    capped: boolean,

    /**
     * The maximum number of documents that may be present in a capped collection.
     */
    max: number,

    /**
     * The maximum size of a capped collection.
     */
    maxSize: number,
    wiredTiger?: WiredTigerData,
    indexDetails?: any,
    ok: number,
  };
  declare export type WiredTigerData = {
    LSM: {
      'bloom filter false positives': number,
      'bloom filter hits': number,
      'bloom filter misses': number,
      'bloom filter pages evicted from cache': number,
      'bloom filter pages read into cache': number,
      'bloom filters in the LSM tree': number,
      'chunks in the LSM tree': number,
      'highest merge generation in the LSM tree': number,
      'queries that could have benefited from a Bloom filter that did not exist': number,
      'sleep for LSM checkpoint throttle': number,
      'sleep for LSM merge throttle': number,
      'total size of bloom filters': number,
      ...
    },
    // 'block-manager': {
    //   'allocations requiring file extension': number,
    //   'blocks allocated': number,
    //   'blocks freed': number,
    //   'checkpoint size': number,
    //   'file allocation unit size': number,
    //   'file bytes available for reuse': number,
    //   'file magic number': number,
    //   'file major version number': number,
    //   'file size in bytes': number,
    //   'minor version number': number,
    //   ...
    // };
    btree: {
      'btree checkpoint generation': number,
      'column-store fixed-size leaf pages': number,
      'column-store internal pages': number,
      'column-store variable-size RLE encoded values': number,
      'column-store variable-size deleted values': number,
      'column-store variable-size leaf pages': number,
      'fixed-record size': number,
      'maximum internal page key size': number,
      'maximum internal page size': number,
      'maximum leaf page key size': number,
      'maximum leaf page size': number,
      'maximum leaf page value size': number,
      'maximum tree depth': number,
      'number of key/value pairs': number,
      'overflow pages': number,
      'pages rewritten by compaction': number,
      'row-store internal pages': number,
      'row-store leaf pages': number,
      ...
    },
    cache: {
      'bytes currently in the cache': number,
      'bytes read into cache': number,
      'bytes written from cache': number,
      'checkpoint blocked page eviction': number,
      'data source pages selected for eviction unable to be evicted': number,
      'hazard pointer blocked page eviction': number,
      'in-memory page passed criteria to be split': number,
      'in-memory page splits': number,
      'internal pages evicted': number,
      'internal pages split during eviction': number,
      'leaf pages split during eviction': number,
      'modified pages evicted': number,
      'overflow pages read into cache': number,
      'overflow values cached in memory': number,
      'page split during eviction deepened the tree': number,
      'page written requiring lookaside records': number,
      'pages read into cache': number,
      'pages read into cache requiring lookaside entries': number,
      'pages requested from the cache': number,
      'pages written from cache': number,
      'pages written requiring in-memory restoration': number,
      'tracked dirty bytes in the cache': number,
      'unmodified pages evicted': number,
      ...
    },
    cache_walk: {
      'Average difference between current eviction generation when the page was last considered': number,
      'Average on-disk page image size seen': number,
      'Clean pages currently in cache': number,
      'Current eviction generation': number,
      'Dirty pages currently in cache': number,
      'Entries in the root page': number,
      'Internal pages currently in cache': number,
      'Leaf pages currently in cache': number,
      'Maximum difference between current eviction generation when the page was last considered': number,
      'Maximum page size seen': number,
      'Minimum on-disk page image size seen': number,
      'On-disk page image sizes smaller than a single allocation unit': number,
      'Pages created in memory and never written': number,
      'Pages currently queued for eviction': number,
      'Pages that could not be queued for eviction': number,
      'Refs skipped during cache traversal': number,
      'Size of the root page': number,
      'Total number of pages currently in cache': number,
      ...
    },
    compression: {
      'compressed pages read': number,
      'compressed pages written': number,
      'page written failed to compress': number,
      'page written was too small to compress': number,
      'raw compression call failed, additional data available': number,
      'raw compression call failed, no additional data available': number,
      'raw compression call succeeded': number,
      ...
    },
    cursor: {
      'bulk-loaded cursor-insert calls': number,
      'create calls': number,
      'cursor-insert key and value bytes inserted': number,
      'cursor-remove key bytes removed': number,
      'cursor-update value bytes updated': number,
      'insert calls': number,
      'next calls': number,
      'prev calls': number,
      'remove calls': number,
      'reset calls': number,
      'restarted searches': number,
      'search calls': number,
      'search near calls': number,
      'truncate calls': number,
      'update calls': number,
      ...
    },
    reconciliation: {
      'dictionary matches': number,
      'fast-path pages deleted': number,
      'internal page key bytes discarded using suffix compression': number,
      'internal page multi-block writes': number,
      'internal-page overflow keys': number,
      'leaf page key bytes discarded using prefix compression': number,
      'leaf page multi-block writes': number,
      'leaf-page overflow keys': number,
      'maximum blocks required for a page': number,
      'overflow values written': number,
      'page checksum matches': number,
      'page reconciliation calls': number,
      'page reconciliation calls for eviction': number,
      'pages deleted': number,
      ...
    },
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#aggregate
   */
  declare export type CollectionAggregationOptions = {
    readPreference?: ReadPreferenceOrMode,

    /**
     * Return the query as cursor, on 2.6 > it returns as a real cursor
     * on pre 2.6 it returns as an emulated cursor.
     */
    cursor?: {
      batchSize?: number,
      ...
    },

    /**
     * Explain returns the aggregation execution plan (requires mongodb 2.6 >).
     */
    explain?: boolean,

    /**
     * Lets the server know if it can use disk to store
     * temporary results for the aggregation (requires mongodb 2.6 >).
     */
    allowDiskUse?: boolean,

    /**
     * specifies a cumulative time limit in milliseconds for processing operations
     * on the cursor. MongoDB interrupts the operation at the earliest following interrupt point.
     */
    maxTimeMS?: number,

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean,
    hint?: string | { [key: string]: any },
    raw?: boolean,
    promoteLongs?: boolean,
    promoteValues?: boolean,
    promoteBuffers?: boolean,
    collation?: CollationDocument,
    comment?: string,
    session?: ClientSession,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertMany
   */
  declare export type CollectionInsertManyOptions = {
    /**
     * Serialize functions on any object.
     */
    serializeFunctions?: boolean,

    /**
     * Force server to assign _id values instead of driver.
     */
    forceServerObjectId?: boolean,

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean,

    /**
     * If true, when an insert fails, don't execute the remaining writes. If false, continue with remaining inserts when one fails.
     */
    ordered?: boolean,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#bulkWrite
   */
  declare export type CollectionBulkWriteOptions = {
    /**
     * Serialize functions on any object.
     */
    serializeFunctions?: boolean,

    /**
     * Execute write operation in ordered or unordered fashion.
     */
    ordered?: boolean,

    /**
     * Allow driver to bypass schema validation in MongoDB 3.2 or higher.
     */
    bypassDocumentValidation?: boolean,
    forceServerObjectId?: boolean,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~BulkWriteOpResult
   */
  declare export type BulkWriteOpResultObject = {
    insertedCount?: number,
    matchedCount?: number,
    modifiedCount?: number,
    deletedCount?: number,
    upsertedCount?: number,
    insertedIds?: any,
    upsertedIds?: any,
    result?: any,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#count
   */
  declare export type MongoCountPreferences = {
    /**
     * The limit of documents to count.
     */
    limit?: number,

    /**
     * The number of documents to skip for the count.
     */
    skip?: number,

    /**
     * An index name hint for the query.
     */
    hint?: string,

    /**
     * The preferred read preference
     */
    readPreference?: ReadPreferenceOrMode,
    maxTimeMS?: number,
    session?: ClientSession,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~deleteWriteOpResult
   */
  declare export type DeleteWriteOpResultObject = {
    result: {
      ok?: number,
      n?: number,
      ...
    },
    connection?: any,
    deletedCount?: number,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~findAndModifyWriteOpResult
   */
  declare export type FindAndModifyWriteOpResultObject<TSchema> = {
    value?: TSchema,
    lastErrorObject?: any,
    ok?: number,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndReplace
   */
  declare export type FindOneAndReplaceOption = {
    projection?: { [key: string]: any },
    sort?: { [key: string]: any },
    maxTimeMS?: number,
    upsert?: boolean,
    returnOriginal?: boolean,
    collation?: CollationDocument,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndUpdate
   */
  declare export type FindOneAndUpdateOption = {
    arrayFilters?: { [key: string]: any }[],
    ...
  } & FindOneAndReplaceOption;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndDelete
   */
  declare export type FindOneAndDeleteOption = {
    projection?: { [key: string]: any },
    sort?: { [key: string]: any },
    maxTimeMS?: number,
    session?: ClientSession,
    collation?: CollationDocument,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#geoHaystackSearch
   */
  declare export type GeoHaystackSearchOptions = {
    readPreference?: ReadPreferenceOrMode,
    maxDistance?: number,
    search?: { [key: string]: any },
    limit?: number,
    session?: ClientSession,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Code.html
   */
  declare export class Code {
    constructor(code: string | Function, scope?: { [key: string]: any }): this;
    code: string | Function;
    scope: any;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/OrderedBulkOperation.html
   */
  declare export type OrderedBulkOperation = {
    length: number,

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/OrderedBulkOperation.html#execute
     */
    execute(callback: MongoCallback<BulkWriteResult>): void,
    execute(options?: FSyncOptions): Promise<BulkWriteResult>,
    execute(options: FSyncOptions, callback: MongoCallback<BulkWriteResult>): void,

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/OrderedBulkOperation.html#find
     */
    find(selector: { [key: string]: any }): FindOperatorsOrdered,

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/OrderedBulkOperation.html#insert
     */
    insert(doc: { [key: string]: any }): OrderedBulkOperation,
  };
  /**
   * https://docs.mongodb.com/manual/reference/method/BulkWriteResult/index.html#BulkWriteResult.upserted
   */
  declare export type BulkWriteResultUpsertedIdObject = {
    index: number,
    _id: ObjectId,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/BulkWriteResult.html
   */
  declare export type BulkWriteResult = {
    ok: number,
    nInserted: number,
    nUpdated: number,
    nUpserted: number,
    nModified: number,
    nRemoved: number,
    getInsertedIds(): { [key: string]: any }[],
    getLastOp(): { [key: string]: any },
    getRawResponse(): { [key: string]: any },
    getUpsertedIdAt(index: number): BulkWriteResultUpsertedIdObject,
    getUpsertedIds(): BulkWriteResultUpsertedIdObject[],
    getWriteConcernError(): WriteConcernError,
    getWriteErrorAt(index: number): WriteError,
    getWriteErrorCount(): number,
    getWriteErrors(): { [key: string]: any }[],
    hasWriteErrors(): boolean,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/WriteError.html
   */
  declare export type WriteError = {
    code: number,
    index: number,
    errmsg: string,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/WriteConcernError.html
   */
  declare export type WriteConcernError = {
    code: number,
    errmsg: string,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/FindOperatorsOrdered.html
   */
  declare export type FindOperatorsOrdered = {
    delete(): OrderedBulkOperation,
    deleteOne(): OrderedBulkOperation,
    replaceOne(doc: { [key: string]: any }): OrderedBulkOperation,
    update(doc: { [key: string]: any }): OrderedBulkOperation,
    updateOne(doc: { [key: string]: any }): OrderedBulkOperation,
    upsert(): FindOperatorsOrdered,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/UnorderedBulkOperation.html
   */
  declare export type UnorderedBulkOperation = {
    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/lib_bulk_unordered.js.html line 339
     */
    length: number,

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/UnorderedBulkOperation.html#execute
     */
    execute(callback: MongoCallback<BulkWriteResult>): void,
    execute(options?: FSyncOptions): Promise<BulkWriteResult>,
    execute(options: FSyncOptions, callback: MongoCallback<BulkWriteResult>): void,

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/UnorderedBulkOperation.html#find
     */
    find(selector: { [key: string]: any }): FindOperatorsUnordered,

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/UnorderedBulkOperation.html#insert
     */
    insert(doc: { [key: string]: any }): UnorderedBulkOperation,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/FindOperatorsUnordered.html
   */
  declare export type FindOperatorsUnordered = {
    length: number,
    remove(): UnorderedBulkOperation,
    removeOne(): UnorderedBulkOperation,
    replaceOne(doc: { [key: string]: any }): UnorderedBulkOperation,
    update(doc: { [key: string]: any }): UnorderedBulkOperation,
    updateOne(doc: { [key: string]: any }): UnorderedBulkOperation,
    upsert(): FindOperatorsUnordered,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOne
   */
  declare export type FindOneOptions = {
    limit?: number,
    sort?: any[] | { [key: string]: any },
    projection?: { [key: string]: any },

    /**
     * @deprecated Use options.projection instead
     */
    fields?: { [key: string]: any },
    skip?: number,
    hint?: { [key: string]: any },
    explain?: boolean,
    snapshot?: boolean,
    timeout?: boolean,
    tailable?: boolean,
    batchSize?: number,
    returnKey?: boolean,
    maxScan?: number,
    min?: number,
    max?: number,
    showDiskLoc?: boolean,
    comment?: string,
    raw?: boolean,
    promoteLongs?: boolean,
    promoteValues?: boolean,
    promoteBuffers?: boolean,
    readPreference?: ReadPreferenceOrMode,
    partial?: boolean,
    maxTimeMS?: number,
    collation?: CollationDocument,
    session?: ClientSession,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne
   */
  declare export type CollectionInsertOneOptions = {
    /**
     * Serialize functions on any object.
     */
    serializeFunctions?: boolean,
    forceServerObjectId?: boolean,
    bypassDocumentValidation?: boolean,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertWriteOpResult
   */
  declare export type InsertWriteOpResult<
    TSchema: {
      _id: any,
      ...
    },
  > = {
    insertedCount: number,
    ops: TSchema[],
    insertedIds: {
      [key: number]: $PropertyType<TSchema, '_id'>,
      ...,
    },
    connection: any,
    result: {
      ok: number,
      n: number,
      ...
    },
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
   */
  declare export type InsertOneWriteOpResult<
    TSchema: {
      _id: any,
      ...
    },
  > = {
    insertedCount: number,
    ops: TSchema[],
    insertedId: $PropertyType<TSchema, '_id'>,
    connection: any,
    result: {
      ok: number,
      n: number,
      ...
    },
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#parallelCollectionScan
   */
  declare export type ParallelCollectionScanOptions = {
    readPreference?: ReadPreferenceOrMode,
    batchSize?: number,
    numCursors?: number,
    raw?: boolean,
    session?: ClientSession,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#replaceOne
   */
  declare export type ReplaceOneOptions = {
    upsert?: boolean,
    bypassDocumentValidation?: boolean,
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateOne
   */
  declare export type UpdateOneOptions = {
    arrayFilters?: { [key: string]: any }[],
    ...
  } & ReplaceOneOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#updateMany
   */
  declare export type UpdateManyOptions = {
    upsert?: boolean,
    arrayFilters?: { [key: string]: any }[],
    ...
  } & CommonOptions;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~updateWriteOpResult
   */
  declare export type UpdateWriteOpResult = {
    result: {
      ok: number,
      n: number,
      nModified: number,
      ...
    },
    connection: any,
    matchedCount: number,
    modifiedCount: number,
    upsertedCount: number,
    upsertedId: {
      _id: ObjectId,
      ...
    },
  };
  /**
   * https://github.com/mongodb/node-mongodb-native/blob/2.2/lib/collection.js#L957
   */
  declare export type ReplaceWriteOpResult = {
    ops: any[],
    ...
  } & UpdateWriteOpResult;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#mapReduce
   */
  declare export type MapReduceOptions = {
    readPreference?: ReadPreferenceOrMode,
    out?: { [key: string]: any },
    query?: { [key: string]: any },
    sort?: { [key: string]: any },
    limit?: number,
    keeptemp?: boolean,
    finalize?: Function | string,
    scope?: { [key: string]: any },
    jsMode?: boolean,
    verbose?: boolean,
    bypassDocumentValidation?: boolean,
    session?: ClientSession,
  };
  declare export type CollectionMapFunction<TSchema> = () => void;
  declare export type CollectionReduceFunction<TKey, TValue> = (
    key: TKey,
    values: TValue[],
  ) => TValue;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~WriteOpResult
   */
  declare export type WriteOpResult = {
    ops: any[],
    connection: any,
    result: any,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#~resultCallback
   */
  declare export type CursorResult = { [key: string]: any } | null | boolean;
  declare type Default = any;
  declare type DefaultSchema = any;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html
   */
  declare export class Cursor<T = Default> extends Readable {
    sortValue: string;
    timeout: boolean;
    readPreference: ReadPreference;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#addCursorFlag
     */
    addCursorFlag(flag: string, value: boolean): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#addQueryModifier
     */
    addQueryModifier(name: string, value: boolean): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#batchSize
     */
    batchSize(value: number): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#clone
     */
    clone(): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#close
     */
    close(): Promise<CursorResult>;
    close(callback: MongoCallback<CursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#collation
     */
    collation(value: CollationDocument): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#comment
     */
    comment(value: string): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#count
     */
    count(callback: MongoCallback<number>): void;
    count(applySkipLimit: boolean, callback: MongoCallback<number>): void;
    count(options: CursorCommentOptions, callback: MongoCallback<number>): void;
    count(
      applySkipLimit: boolean,
      options: CursorCommentOptions,
      callback: MongoCallback<number>,
    ): void;
    count(applySkipLimit?: boolean, options?: CursorCommentOptions): Promise<number>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#explain
     */
    explain(): Promise<CursorResult>;
    explain(callback: MongoCallback<CursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#filter
     */
    filter(filter: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#forEach
     */
    forEach(iterator: IteratorCallback<T>, callback: EndCallback): void;
    forEach(iterator: IteratorCallback<T>): Promise<void>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#hasNext
     */
    hasNext(): Promise<boolean>;
    hasNext(callback: MongoCallback<boolean>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#hint
     */
    hint(hint: string | { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#isClosed
     */
    isClosed(): boolean;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#limit
     */
    limit(value: number): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#map
     */
    map<U>(transform: (document: T) => U): Cursor<U>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#max
     */
    max(max: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#maxAwaitTimeMS
     */
    maxAwaitTimeMS(value: number): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#maxScan
     */
    maxScan(maxScan: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#maxTimeMS
     */
    maxTimeMS(value: number): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#min
     */
    min(min: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#next
     */
    next(): Promise<T | null>;
    next(callback: MongoCallback<T | null>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#project
     */
    project(value: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#read
     */
    read(size: number): string | Buffer | void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#next
     */
    returnKey(returnKey: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#rewind
     */
    rewind(): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#setCursorOption
     */
    setCursorOption(field: string, value: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#setReadPreference
     */
    setReadPreference(readPreference: ReadPreferenceOrMode): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#showRecordId
     */
    showRecordId(showRecordId: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#skip
     */
    skip(value: number): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#snapshot
     */
    snapshot(snapshot: { [key: string]: any }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#sort
     */
    sort(
      keyOrList: string | { [key: string]: any }[] | { [key: string]: any },
      direction?: number,
    ): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#stream
     */
    stream(options?: {
      transform?: (document: T) => any,
      ...
    }): Cursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#toArray
     */
    toArray(): Promise<T[]>;
    toArray(callback: MongoCallback<T[]>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#unshift
     */
    unshift(stream: Buffer | string): void;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#count
   */
  declare export type CursorCommentOptions = {
    skip?: number,
    limit?: number,
    maxTimeMS?: number,
    hint?: string,
    readPreference?: ReadPreferenceOrMode,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#~iteratorCallback
   */
  declare export type IteratorCallback<T> = (doc: T) => void;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#~endCallback
   */
  declare export type EndCallback = (error: MongoError) => void;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#~resultCallback
   */
  declare export type AggregationCursorResult = { [key: string]: any } | null;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html
   */
  declare export class AggregationCursor<T = Default> extends Readable {
    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#batchSize
     */
    batchSize(value: number): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#clone
     */
    clone(): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#close
     */
    close(): Promise<AggregationCursorResult>;
    close(callback: MongoCallback<AggregationCursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#each
     */
    each(callback: MongoCallback<AggregationCursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#explain
     */
    explain(): Promise<AggregationCursorResult>;
    explain(callback: MongoCallback<AggregationCursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#geoNear
     */
    geoNear(document: { [key: string]: any }): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#group
     */
    group<U>(document: { [key: string]: any }): AggregationCursor<U>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#hasNext
     */
    hasNext(): Promise<boolean>;
    hasNext(callback: MongoCallback<boolean>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#isClosed
     */
    isClosed(): boolean;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#limit
     */
    limit(value: number): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#lookup
     */
    lookup(document: { [key: string]: any }): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#match
     */
    match(document: { [key: string]: any }): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#maxTimeMS
     */
    maxTimeMS(value: number): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#next
     */
    next(): Promise<T | null>;
    next(callback: MongoCallback<T | null>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#out
     */
    out(destination: string): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#project
     */
    project<U>(document: { [key: string]: any }): AggregationCursor<U>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#read
     */
    read(size: number): string | Buffer | void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#redact
     */
    redact(document: { [key: string]: any }): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#rewind
     */
    rewind(): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#setEncoding
     */
    skip(value: number): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#sort
     */
    sort(document: { [key: string]: any }): AggregationCursor<T>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#toArray
     */
    toArray(): Promise<T[]>;
    toArray(callback: MongoCallback<T[]>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#unshift
     */
    unshift(stream: Buffer | string): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/AggregationCursor.html#unwind
     */
    unwind<U>(field: string): AggregationCursor<U>;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#~resultCallback
   */
  declare export type CommandCursorResult = { [key: string]: any } | null;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html
   */
  declare export class CommandCursor extends Readable {
    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#hasNext
     */
    hasNext(): Promise<boolean>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#hasNext
     */
    hasNext(callback: MongoCallback<boolean>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#batchSize
     */
    batchSize(value: number): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#clone
     */
    clone(): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#close
     */
    close(): Promise<CommandCursorResult>;
    close(callback: MongoCallback<CommandCursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#each
     */
    each(callback: MongoCallback<CommandCursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#isClosed
     */
    isClosed(): boolean;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#maxTimeMS
     */
    maxTimeMS(value: number): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#next
     */
    next(): Promise<CommandCursorResult>;
    next(callback: MongoCallback<CommandCursorResult>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#read
     */
    read(size: number): string | Buffer | void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#rewind
     */
    rewind(): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#setReadPreference
     */
    setReadPreference(readPreference: ReadPreferenceOrMode): CommandCursor;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#toArray
     */
    toArray(): Promise<any[]>;
    toArray(callback: MongoCallback<any[]>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/CommandCursor.html#unshift
     */
    unshift(stream: Buffer | string): void;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html
   */
  declare export class GridFSBucket {
    constructor(db: Db, options?: GridFSBucketOptions): this;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#delete
     */
    delete(id: ObjectId, callback?: GridFSBucketErrorCallback): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#drop
     */
    drop(callback?: GridFSBucketErrorCallback): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#find
     */
    find(filter?: { [key: string]: any }, options?: GridFSBucketFindOptions): Cursor<any>;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#openDownloadStream
     */
    openDownloadStream(
      id: ObjectId,
      options?: {
        start: number,
        end: number,
        ...
      },
    ): GridFSBucketReadStream;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#openDownloadStreamByName
     */
    openDownloadStreamByName(
      filename: string,
      options?: {
        revision: number,
        start: number,
        end: number,
        ...
      },
    ): GridFSBucketReadStream;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#openUploadStream
     */
    openUploadStream(
      filename: string,
      options?: GridFSBucketOpenUploadStreamOptions,
    ): GridFSBucketWriteStream;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#openUploadStreamWithId
     */
    openUploadStreamWithId(
      id: GridFSBucketWriteStreamId,
      filename: string,
      options?: GridFSBucketOpenUploadStreamOptions,
    ): GridFSBucketWriteStream;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#rename
     */
    rename(id: ObjectId, filename: string, callback?: GridFSBucketErrorCallback): void;
  }
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html
   */
  declare export type GridFSBucketOptions = {
    bucketName?: string,
    chunkSizeBytes?: number,
    writeConcern?: WriteConcern,
    readPreference?: ReadPreferenceOrMode,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#~errorCallback
   */
  declare export type GridFSBucketErrorCallback = (err?: MongoError) => void;
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#find
   */
  declare export type GridFSBucketFindOptions = {
    batchSize?: number,
    limit?: number,
    maxTimeMS?: number,
    noCursorTimeout?: boolean,
    skip?: number,
    sort?: { [key: string]: any },
  };
  /**
   * https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucket.html#openUploadStream
   */
  declare export type GridFSBucketOpenUploadStreamOptions = {
    chunkSizeBytes?: number,
    metadata?: { [key: string]: any },
    contentType?: string,
    aliases?: string[],
  };
  /**
   * https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucketReadStream.html
   */
  declare export class GridFSBucketReadStream extends Readable {
    id: ObjectId;
    constructor(
      chunks: Collection<any>,
      files: Collection<any>,
      readPreference: { [key: string]: any },
      filter: { [key: string]: any },
      options?: GridFSBucketReadStreamOptions,
    ): this;
  }
  /**
   * https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucketReadStream.html
   */
  declare export type GridFSBucketReadStreamOptions = {
    sort?: number,
    skip?: number,
    start?: number,
    end?: number,
  };
  /**
   * https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucketWriteStream.html
   */
  declare export class GridFSBucketWriteStream extends Writable {
    id: GridFSBucketWriteStreamId;
    constructor(
      bucket: GridFSBucket,
      filename: string,
      options?: GridFSBucketWriteStreamOptions,
    ): this;
  }
  /**
   * https://mongodb.github.io/node-mongodb-native/3.1/api/GridFSBucketWriteStream.html
   */
  declare export type GridFSBucketWriteStreamOptions = {
    /**
     * Custom file id for the GridFS file.
     */
    id?: GridFSBucketWriteStreamId,

    /**
     * The chunk size to use, in bytes
     */
    chunkSizeBytes?: number,

    /**
     * Default false; If true, disables adding an md5 field to file data
     */
    disableMD5?: boolean,
    ...
  } & WriteConcern;

  /**
   * http://mongodb.github.io/node-mongodb-native/3.3/api/ChangeStream.html
   */
  declare export class ChangeStream extends Readable {
    resumeToken: ResumeToken;
    constructor(
      changeDomain: Db | Collection<>,
      pipeline: { [key: string]: any }[],
      options?: ChangeStreamOptions,
    ): this;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/ChangeStream.html#close
     */
    close(): Promise<any>;
    close(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/ChangeStream.html#hasNext
     */
    hasNext(): Promise<any>;
    hasNext(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/ChangeStream.html#isClosed
     */
    isClosed(): boolean;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/ChangeStream.html#next
     */
    next(): Promise<any>;
    next(callback: MongoCallback<any>): void;

    /**
     * http://mongodb.github.io/node-mongodb-native/3.1/api/ChangeStream.html#stream
     */
    stream(options?: {
      transform?: Function,
      ...
    }): Cursor<>;
  }
  declare export class ResumeToken {}
  /**
   * https://mongodb.github.io/node-mongodb-native/3.3/api/global.html#ChangeStreamOptions
   */
  declare export type ChangeStreamOptions = {
    fullDocument?: string,
    maxAwaitTimeMS?: number,
    resumeAfter?: { [key: string]: any },
    startAfter?: { [key: string]: any },
    startAtOperationTime?: Timestamp,
    batchSize?: number,
    collation?: CollationDocument,
    readPreference?: ReadPreferenceOrMode,
  };
  declare type GridFSBucketWriteStreamId = string | number | { [key: string]: any } | ObjectId;
  declare export type LoggerOptions = {
    /**
     * Custom logger function
     */
    loggerLevel?: string,

    /**
     * Override default global log level.
     */
    logger?: log,
  };
  declare export type log = (message?: string, state?: LoggerState) => void;
  declare export type LoggerState = {
    type: string,
    message: string,
    className: string,
    pid: number,
    date: number,
  };
  /**
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Logger.html
   */
  declare export class Logger {
    constructor(className: string, options?: LoggerOptions): this;

    /**
     * Log a message at the debug level
     */
    debug(message: string, state: LoggerState): void;

    /**
     * Log a message at the warn level
     */
    warn(message: string, state: LoggerState): void;

    /**
     * Log a message at the info level
     */
    info(message: string, state: LoggerState): void;

    /**
     * Log a message at the error level
     */
    error(message: string, state: LoggerState): void;

    /**
     * Is the logger set at info level
     */
    isInfo(): boolean;

    /**
     * Is the logger set at error level
     */
    isError(): boolean;

    /**
     * Is the logger set at error level
     */
    isWarn(): boolean;

    /**
     * Is the logger set at debug level
     */
    isDebug(): boolean;

    /**
     * Resets the logger to default settings, error and no filtered classes
     */
    static reset(): void;

    /**
     * Get the current logger function
     */
    static currentLogger(): log;
    static setCurrentLogger(log: log): void;

    /**
     * Set what classes to log.
     */
    static filter(type: string, values: string[]): void;

    /**
     * Set the current log level
     */
    static setLevel(level: string): void;
  }
  /**
   * https://docs.mongodb.com/manual/reference/collation/#collation-document-fields
   */
  declare export type CollationDocument = {
    locale: string,
    strength?: number,
    caseLevel?: boolean,
    caseFirst?: string,
    numericOrdering?: boolean,
    alternate?: string,
    maxVariable?: string,
    backwards?: boolean,
    normalization?: boolean,
  };
  /**
   * https://docs.mongodb.com/manual/reference/command/createIndexes/
   */
  declare export type IndexSpecification = {
    key: { [key: string]: any },
    name?: string,
    background?: boolean,
    unique?: boolean,
    partialFilterExpression?: { [key: string]: any },
    sparse?: boolean,
    expireAfterSeconds?: number,
    storageEngine?: { [key: string]: any },
    weights?: { [key: string]: any },
    default_language?: string,
    language_override?: string,
    textIndexVersion?: number,
    // '2dsphereIndexVersion'?: number;
    bits?: number,
    min?: number,
    max?: number,
    bucketSize?: number,
    collation?: CollationDocument,
  };
}

/**
 * We include stubs for each file inside this npm package in case you need to
 * require those files directly. Feel free to delete any files that aren't
 * needed.
 */
declare module 'mongodb/lib/admin' {
  declare module.exports: any;
}

declare module 'mongodb/lib/aggregation_cursor' {
  declare module.exports: any;
}

declare module 'mongodb/lib/apm' {
  declare module.exports: any;
}

declare module 'mongodb/lib/async/async_iterator' {
  declare module.exports: any;
}

declare module 'mongodb/lib/bulk/common' {
  declare module.exports: any;
}

declare module 'mongodb/lib/bulk/ordered' {
  declare module.exports: any;
}

declare module 'mongodb/lib/bulk/unordered' {
  declare module.exports: any;
}

declare module 'mongodb/lib/change_stream' {
  declare module.exports: any;
}

declare module 'mongodb/lib/collection' {
  declare module.exports: any;
}

declare module 'mongodb/lib/command_cursor' {
  declare module.exports: any;
}

declare module 'mongodb/lib/constants' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/auth_provider' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/defaultAuthProviders' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/gssapi' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/mongo_credentials' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/mongocr' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/plain' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/scram' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/sspi' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/auth/x509' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/cmap/connection' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/cmap/message_stream' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/apm' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/command_result' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/commands' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/connect' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/connection' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/logger' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/msg' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/pool' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/connection/utils' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/cursor' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/error' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/common' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/monitoring' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/server_description' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/server_selection' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/server' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/srv_polling' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/topology_description' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sdam/topology' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/sessions' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/tools/smoke_plugin' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/topologies/mongos' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/topologies/read_preference' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/topologies/replset_state' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/topologies/replset' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/topologies/server' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/topologies/shared' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/transactions' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/uri_parser' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/utils' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/command' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/compression' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/constants' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/get_more' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/kill_cursors' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/query' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/shared' {
  declare module.exports: any;
}

declare module 'mongodb/lib/core/wireprotocol/write_command' {
  declare module.exports: any;
}

declare module 'mongodb/lib/cursor' {
  declare module.exports: any;
}

declare module 'mongodb/lib/db' {
  declare module.exports: any;
}

declare module 'mongodb/lib/dynamic_loaders' {
  declare module.exports: any;
}

declare module 'mongodb/lib/error' {
  declare module.exports: any;
}

declare module 'mongodb/lib/gridfs-stream/download' {
  declare module.exports: any;
}

declare module 'mongodb/lib/gridfs-stream' {
  declare module.exports: any;
}

declare module 'mongodb/lib/gridfs-stream/upload' {
  declare module.exports: any;
}

declare module 'mongodb/lib/gridfs/chunk' {
  declare module.exports: any;
}

declare module 'mongodb/lib/gridfs/grid_store' {
  declare module.exports: any;
}

declare module 'mongodb/lib/mongo_client' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/add_user' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/admin_ops' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/aggregate' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/bulk_write' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/close' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/collection_ops' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/collections' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/command_v2' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/command' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/common_functions' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/connect' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/count_documents' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/count' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/create_collection' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/create_index' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/create_indexes' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/cursor_ops' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/db_ops' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/delete_many' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/delete_one' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/distinct' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/drop_index' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/drop_indexes' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/drop' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/estimated_document_count' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/execute_db_admin_command' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/execute_operation' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/explain' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/find_and_modify' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/find_one_and_delete' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/find_one_and_replace' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/find_one_and_update' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/find_one' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/find' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/geo_haystack_search' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/has_next' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/index_exists' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/index_information' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/indexes' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/insert_many' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/insert_one' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/is_capped' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/list_collections' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/list_databases' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/list_indexes' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/map_reduce' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/next' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/operation' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/options_operation' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/profiling_level' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/re_index' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/remove_user' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/rename' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/replace_one' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/set_profiling_level' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/stats' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/to_array' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/update_many' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/update_one' {
  declare module.exports: any;
}

declare module 'mongodb/lib/operations/validate_collection' {
  declare module.exports: any;
}

declare module 'mongodb/lib/read_concern' {
  declare module.exports: any;
}

declare module 'mongodb/lib/topologies/mongos' {
  declare module.exports: any;
}

declare module 'mongodb/lib/topologies/native_topology' {
  declare module.exports: any;
}

declare module 'mongodb/lib/topologies/replset' {
  declare module.exports: any;
}

declare module 'mongodb/lib/topologies/server' {
  declare module.exports: any;
}

declare module 'mongodb/lib/topologies/topology_base' {
  declare module.exports: any;
}

declare module 'mongodb/lib/url_parser' {
  declare module.exports: any;
}

declare module 'mongodb/lib/utils' {
  declare module.exports: any;
}

declare module 'mongodb/lib/write_concern' {
  declare module.exports: any;
}

// Filename aliases
declare module 'mongodb/index' {
  declare module.exports: $Exports<'mongodb'>;
}
declare module 'mongodb/index.js' {
  declare module.exports: $Exports<'mongodb'>;
}
declare module 'mongodb/lib/admin.js' {
  declare module.exports: $Exports<'mongodb/lib/admin'>;
}
declare module 'mongodb/lib/aggregation_cursor.js' {
  declare module.exports: $Exports<'mongodb/lib/aggregation_cursor'>;
}
declare module 'mongodb/lib/apm.js' {
  declare module.exports: $Exports<'mongodb/lib/apm'>;
}
declare module 'mongodb/lib/async/async_iterator.js' {
  declare module.exports: $Exports<'mongodb/lib/async/async_iterator'>;
}
declare module 'mongodb/lib/bulk/common.js' {
  declare module.exports: $Exports<'mongodb/lib/bulk/common'>;
}
declare module 'mongodb/lib/bulk/ordered.js' {
  declare module.exports: $Exports<'mongodb/lib/bulk/ordered'>;
}
declare module 'mongodb/lib/bulk/unordered.js' {
  declare module.exports: $Exports<'mongodb/lib/bulk/unordered'>;
}
declare module 'mongodb/lib/change_stream.js' {
  declare module.exports: $Exports<'mongodb/lib/change_stream'>;
}
declare module 'mongodb/lib/collection.js' {
  declare module.exports: $Exports<'mongodb/lib/collection'>;
}
declare module 'mongodb/lib/command_cursor.js' {
  declare module.exports: $Exports<'mongodb/lib/command_cursor'>;
}
declare module 'mongodb/lib/constants.js' {
  declare module.exports: $Exports<'mongodb/lib/constants'>;
}
declare module 'mongodb/lib/core/auth/auth_provider.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/auth_provider'>;
}
declare module 'mongodb/lib/core/auth/defaultAuthProviders.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/defaultAuthProviders'>;
}
declare module 'mongodb/lib/core/auth/gssapi.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/gssapi'>;
}
declare module 'mongodb/lib/core/auth/mongo_credentials.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/mongo_credentials'>;
}
declare module 'mongodb/lib/core/auth/mongocr.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/mongocr'>;
}
declare module 'mongodb/lib/core/auth/plain.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/plain'>;
}
declare module 'mongodb/lib/core/auth/scram.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/scram'>;
}
declare module 'mongodb/lib/core/auth/sspi.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/sspi'>;
}
declare module 'mongodb/lib/core/auth/x509.js' {
  declare module.exports: $Exports<'mongodb/lib/core/auth/x509'>;
}
declare module 'mongodb/lib/core/cmap/connection.js' {
  declare module.exports: $Exports<'mongodb/lib/core/cmap/connection'>;
}
declare module 'mongodb/lib/core/cmap/message_stream.js' {
  declare module.exports: $Exports<'mongodb/lib/core/cmap/message_stream'>;
}
declare module 'mongodb/lib/core/connection/apm.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/apm'>;
}
declare module 'mongodb/lib/core/connection/command_result.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/command_result'>;
}
declare module 'mongodb/lib/core/connection/commands.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/commands'>;
}
declare module 'mongodb/lib/core/connection/connect.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/connect'>;
}
declare module 'mongodb/lib/core/connection/connection.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/connection'>;
}
declare module 'mongodb/lib/core/connection/logger.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/logger'>;
}
declare module 'mongodb/lib/core/connection/msg.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/msg'>;
}
declare module 'mongodb/lib/core/connection/pool.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/pool'>;
}
declare module 'mongodb/lib/core/connection/utils.js' {
  declare module.exports: $Exports<'mongodb/lib/core/connection/utils'>;
}
declare module 'mongodb/lib/core/cursor.js' {
  declare module.exports: $Exports<'mongodb/lib/core/cursor'>;
}
declare module 'mongodb/lib/core/error.js' {
  declare module.exports: $Exports<'mongodb/lib/core/error'>;
}
declare module 'mongodb/lib/core/index' {
  declare module.exports: $Exports<'mongodb/lib/core'>;
}
declare module 'mongodb/lib/core/index.js' {
  declare module.exports: $Exports<'mongodb/lib/core'>;
}
declare module 'mongodb/lib/core/sdam/common.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/common'>;
}
declare module 'mongodb/lib/core/sdam/monitoring.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/monitoring'>;
}
declare module 'mongodb/lib/core/sdam/server_description.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/server_description'>;
}
declare module 'mongodb/lib/core/sdam/server_selection.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/server_selection'>;
}
declare module 'mongodb/lib/core/sdam/server.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/server'>;
}
declare module 'mongodb/lib/core/sdam/srv_polling.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/srv_polling'>;
}
declare module 'mongodb/lib/core/sdam/topology_description.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/topology_description'>;
}
declare module 'mongodb/lib/core/sdam/topology.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sdam/topology'>;
}
declare module 'mongodb/lib/core/sessions.js' {
  declare module.exports: $Exports<'mongodb/lib/core/sessions'>;
}
declare module 'mongodb/lib/core/tools/smoke_plugin.js' {
  declare module.exports: $Exports<'mongodb/lib/core/tools/smoke_plugin'>;
}
declare module 'mongodb/lib/core/topologies/mongos.js' {
  declare module.exports: $Exports<'mongodb/lib/core/topologies/mongos'>;
}
declare module 'mongodb/lib/core/topologies/read_preference.js' {
  declare module.exports: $Exports<'mongodb/lib/core/topologies/read_preference'>;
}
declare module 'mongodb/lib/core/topologies/replset_state.js' {
  declare module.exports: $Exports<'mongodb/lib/core/topologies/replset_state'>;
}
declare module 'mongodb/lib/core/topologies/replset.js' {
  declare module.exports: $Exports<'mongodb/lib/core/topologies/replset'>;
}
declare module 'mongodb/lib/core/topologies/server.js' {
  declare module.exports: $Exports<'mongodb/lib/core/topologies/server'>;
}
declare module 'mongodb/lib/core/topologies/shared.js' {
  declare module.exports: $Exports<'mongodb/lib/core/topologies/shared'>;
}
declare module 'mongodb/lib/core/transactions.js' {
  declare module.exports: $Exports<'mongodb/lib/core/transactions'>;
}
declare module 'mongodb/lib/core/uri_parser.js' {
  declare module.exports: $Exports<'mongodb/lib/core/uri_parser'>;
}
declare module 'mongodb/lib/core/utils.js' {
  declare module.exports: $Exports<'mongodb/lib/core/utils'>;
}
declare module 'mongodb/lib/core/wireprotocol/command.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/command'>;
}
declare module 'mongodb/lib/core/wireprotocol/compression.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/compression'>;
}
declare module 'mongodb/lib/core/wireprotocol/constants.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/constants'>;
}
declare module 'mongodb/lib/core/wireprotocol/get_more.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/get_more'>;
}
declare module 'mongodb/lib/core/wireprotocol/index' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol'>;
}
declare module 'mongodb/lib/core/wireprotocol/index.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol'>;
}
declare module 'mongodb/lib/core/wireprotocol/kill_cursors.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/kill_cursors'>;
}
declare module 'mongodb/lib/core/wireprotocol/query.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/query'>;
}
declare module 'mongodb/lib/core/wireprotocol/shared.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/shared'>;
}
declare module 'mongodb/lib/core/wireprotocol/write_command.js' {
  declare module.exports: $Exports<'mongodb/lib/core/wireprotocol/write_command'>;
}
declare module 'mongodb/lib/cursor.js' {
  declare module.exports: $Exports<'mongodb/lib/cursor'>;
}
declare module 'mongodb/lib/db.js' {
  declare module.exports: $Exports<'mongodb/lib/db'>;
}
declare module 'mongodb/lib/dynamic_loaders.js' {
  declare module.exports: $Exports<'mongodb/lib/dynamic_loaders'>;
}
declare module 'mongodb/lib/error.js' {
  declare module.exports: $Exports<'mongodb/lib/error'>;
}
declare module 'mongodb/lib/gridfs-stream/download.js' {
  declare module.exports: $Exports<'mongodb/lib/gridfs-stream/download'>;
}
declare module 'mongodb/lib/gridfs-stream/index' {
  declare module.exports: $Exports<'mongodb/lib/gridfs-stream'>;
}
declare module 'mongodb/lib/gridfs-stream/index.js' {
  declare module.exports: $Exports<'mongodb/lib/gridfs-stream'>;
}
declare module 'mongodb/lib/gridfs-stream/upload.js' {
  declare module.exports: $Exports<'mongodb/lib/gridfs-stream/upload'>;
}
declare module 'mongodb/lib/gridfs/chunk.js' {
  declare module.exports: $Exports<'mongodb/lib/gridfs/chunk'>;
}
declare module 'mongodb/lib/gridfs/grid_store.js' {
  declare module.exports: $Exports<'mongodb/lib/gridfs/grid_store'>;
}
declare module 'mongodb/lib/mongo_client.js' {
  declare module.exports: $Exports<'mongodb/lib/mongo_client'>;
}
declare module 'mongodb/lib/operations/add_user.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/add_user'>;
}
declare module 'mongodb/lib/operations/admin_ops.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/admin_ops'>;
}
declare module 'mongodb/lib/operations/aggregate.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/aggregate'>;
}
declare module 'mongodb/lib/operations/bulk_write.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/bulk_write'>;
}
declare module 'mongodb/lib/operations/close.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/close'>;
}
declare module 'mongodb/lib/operations/collection_ops.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/collection_ops'>;
}
declare module 'mongodb/lib/operations/collections.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/collections'>;
}
declare module 'mongodb/lib/operations/command_v2.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/command_v2'>;
}
declare module 'mongodb/lib/operations/command.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/command'>;
}
declare module 'mongodb/lib/operations/common_functions.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/common_functions'>;
}
declare module 'mongodb/lib/operations/connect.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/connect'>;
}
declare module 'mongodb/lib/operations/count_documents.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/count_documents'>;
}
declare module 'mongodb/lib/operations/count.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/count'>;
}
declare module 'mongodb/lib/operations/create_collection.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/create_collection'>;
}
declare module 'mongodb/lib/operations/create_index.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/create_index'>;
}
declare module 'mongodb/lib/operations/create_indexes.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/create_indexes'>;
}
declare module 'mongodb/lib/operations/cursor_ops.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/cursor_ops'>;
}
declare module 'mongodb/lib/operations/db_ops.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/db_ops'>;
}
declare module 'mongodb/lib/operations/delete_many.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/delete_many'>;
}
declare module 'mongodb/lib/operations/delete_one.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/delete_one'>;
}
declare module 'mongodb/lib/operations/distinct.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/distinct'>;
}
declare module 'mongodb/lib/operations/drop_index.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/drop_index'>;
}
declare module 'mongodb/lib/operations/drop_indexes.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/drop_indexes'>;
}
declare module 'mongodb/lib/operations/drop.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/drop'>;
}
declare module 'mongodb/lib/operations/estimated_document_count.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/estimated_document_count'>;
}
declare module 'mongodb/lib/operations/execute_db_admin_command.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/execute_db_admin_command'>;
}
declare module 'mongodb/lib/operations/execute_operation.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/execute_operation'>;
}
declare module 'mongodb/lib/operations/explain.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/explain'>;
}
declare module 'mongodb/lib/operations/find_and_modify.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/find_and_modify'>;
}
declare module 'mongodb/lib/operations/find_one_and_delete.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/find_one_and_delete'>;
}
declare module 'mongodb/lib/operations/find_one_and_replace.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/find_one_and_replace'>;
}
declare module 'mongodb/lib/operations/find_one_and_update.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/find_one_and_update'>;
}
declare module 'mongodb/lib/operations/find_one.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/find_one'>;
}
declare module 'mongodb/lib/operations/find.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/find'>;
}
declare module 'mongodb/lib/operations/geo_haystack_search.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/geo_haystack_search'>;
}
declare module 'mongodb/lib/operations/has_next.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/has_next'>;
}
declare module 'mongodb/lib/operations/index_exists.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/index_exists'>;
}
declare module 'mongodb/lib/operations/index_information.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/index_information'>;
}
declare module 'mongodb/lib/operations/indexes.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/indexes'>;
}
declare module 'mongodb/lib/operations/insert_many.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/insert_many'>;
}
declare module 'mongodb/lib/operations/insert_one.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/insert_one'>;
}
declare module 'mongodb/lib/operations/is_capped.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/is_capped'>;
}
declare module 'mongodb/lib/operations/list_collections.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/list_collections'>;
}
declare module 'mongodb/lib/operations/list_databases.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/list_databases'>;
}
declare module 'mongodb/lib/operations/list_indexes.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/list_indexes'>;
}
declare module 'mongodb/lib/operations/map_reduce.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/map_reduce'>;
}
declare module 'mongodb/lib/operations/next.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/next'>;
}
declare module 'mongodb/lib/operations/operation.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/operation'>;
}
declare module 'mongodb/lib/operations/options_operation.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/options_operation'>;
}
declare module 'mongodb/lib/operations/profiling_level.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/profiling_level'>;
}
declare module 'mongodb/lib/operations/re_index.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/re_index'>;
}
declare module 'mongodb/lib/operations/remove_user.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/remove_user'>;
}
declare module 'mongodb/lib/operations/rename.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/rename'>;
}
declare module 'mongodb/lib/operations/replace_one.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/replace_one'>;
}
declare module 'mongodb/lib/operations/set_profiling_level.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/set_profiling_level'>;
}
declare module 'mongodb/lib/operations/stats.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/stats'>;
}
declare module 'mongodb/lib/operations/to_array.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/to_array'>;
}
declare module 'mongodb/lib/operations/update_many.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/update_many'>;
}
declare module 'mongodb/lib/operations/update_one.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/update_one'>;
}
declare module 'mongodb/lib/operations/validate_collection.js' {
  declare module.exports: $Exports<'mongodb/lib/operations/validate_collection'>;
}
declare module 'mongodb/lib/read_concern.js' {
  declare module.exports: $Exports<'mongodb/lib/read_concern'>;
}
declare module 'mongodb/lib/topologies/mongos.js' {
  declare module.exports: $Exports<'mongodb/lib/topologies/mongos'>;
}
declare module 'mongodb/lib/topologies/native_topology.js' {
  declare module.exports: $Exports<'mongodb/lib/topologies/native_topology'>;
}
declare module 'mongodb/lib/topologies/replset.js' {
  declare module.exports: $Exports<'mongodb/lib/topologies/replset'>;
}
declare module 'mongodb/lib/topologies/server.js' {
  declare module.exports: $Exports<'mongodb/lib/topologies/server'>;
}
declare module 'mongodb/lib/topologies/topology_base.js' {
  declare module.exports: $Exports<'mongodb/lib/topologies/topology_base'>;
}
declare module 'mongodb/lib/url_parser.js' {
  declare module.exports: $Exports<'mongodb/lib/url_parser'>;
}
declare module 'mongodb/lib/utils.js' {
  declare module.exports: $Exports<'mongodb/lib/utils'>;
}
declare module 'mongodb/lib/write_concern.js' {
  declare module.exports: $Exports<'mongodb/lib/write_concern'>;
}
