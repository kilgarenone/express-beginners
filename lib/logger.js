/*
    Logging using the Winston library
    https://github.com/winstonjs/winston
*/

const fs = require('fs');
const Winston = require('winston');
const WinstonRotate = require('winston-daily-rotate-file');

const development = process.env.NODE_ENV !== 'production';
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

Winston.emitErrs = true;

const logger = new (Winston.Logger)({
    transports: [
        // Logging to files
        new (Winston.transports.Console)({
            timestamp: tsFormat, // set the format of log's timestamp
            colorize: true,
            level: 'info', // 'info' is the maximum level of messages that a transport should log. https://github.com/winstonjs/winston#logging-levels
        }),
        // Log into a new dated file every new day
        new WinstonRotate({
            filename: `${logDir}/-results.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            humanReadableUnhandledException: true,
            level: development ? 'verbose' : 'info',
        }),
    ],
    exitOnError: false,
});

logger.stream = {
    write(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
