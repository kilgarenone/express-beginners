const fs = require('fs');
const Winston = require('winston');
const WinstonRotate = require('winston-daily-rotate-file');

const development = process.env.mode !== 'production';
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

Winston.emitErrs = true;

const logger = new (Winston.Logger)({
    transports: [
        new (Winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info',
        }),
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
