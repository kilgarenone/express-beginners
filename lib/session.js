const redisClient = require('./redisClient.js');
const session = require('express-session');
const RedisSessionStore = require('connect-redis')(session);
const config = require('../config.js')(process.env.NODE_ENV);

const development = process.env.NODE_ENV !== 'production';
// TEMP VARIABLES
const sessionOptions = { resave: false,
                         saveUninitialized: false,
                         cookie: { maxAge: 30 * 60 * 1000 },
                         secret: config.cookieSecret,
                         store: new RedisSessionStore({
                             client: redisClient,
                         }),
};

if (!development) {
    sessionOptions.cookie.secure = true; // serve secure cookies
}

module.exports = session(sessionOptions);
