// Bring Mongoose into the app
const mongoose = require('mongoose');
// Bring Logger into the app
const logger = require('./logger.js');
// Promisify mongoose query
mongoose.Promise = global.Promise;

const opts = {
    server: {
        socketOptions: { keepAlive: 1 },
    },
};

const bindEventsToDb = (function () {
    // Reuse this db in other files
    var db;

    const runInTestMode = 'mode_test';
    // Build the connection string. 
    // TODO: in production, URI should come from an env variable instead of hard- coded 
    const dbURI = 'mongodb://localhost/storeup';
    const testDbURI = 'mongodb://localhost/test';

    const gracefulExit = function () {
        mongoose.connection.close(() => {
            logger.info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    };

    const connect = function (mode) {
        if (db) return true;

        const dbConnectUri = mode === runInTestMode ? testDbURI : dbURI;
        // Create the default database connection pool
        mongoose.connect(dbConnectUri, opts);

        db = mongoose.connection;
        // CONNECTION EVENTS
        // When successfully connected
        db.on('connected', () => {
            logger.info(`Mongoose default connection open to: ${dbURI}`);
        });

        // If the connection throws an error
        db.on('error', (err) => {
            logger.info(`Mongoose default connection error: ${err}`);
        });

        // When the connection is disconnected
        db.on('disconnected', () => {
            logger.info('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
    };


    const getDb = function () {
        return db;
    };

    const getConnectionString = function () {
        return dbURI;
    };

    return {
        connect,
        getDb,
        getConnectionString,
    };
}());

module.exports = bindEventsToDb;

