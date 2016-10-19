const redisClient = require('./redisClient.js');
const session = require('express-session');
const RedisSessionStore = require('connect-redis')(session);
const credentials = require('../credentials.js');

const development = process.env.mode !== 'production';
// TEMP VARIABLES
const sessionOptions = { resave: false,
                         saveUninitialized: false,
                         cookie: { maxAge: 30 * 60 * 1000 },
                         secret: credentials.cookieSecret,
                         store: new RedisSessionStore({
                             client: redisClient,
                         }),
};

if (!development) {
    sessionOptions.cookie.secure = true; // serve secure cookies
}

module.exports = session(sessionOptions);
