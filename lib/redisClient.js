/*
    To run redis on Windows, see here http://stackoverflow.com/a/32265082
    To access records in redis, run the 'redis-cli.exe' in the downloaded folder, and see http://stackoverflow.com/a/23877883
*/
const logger = require('./logger.js');
const blueBird = require('bluebird');
const redis = require('redis');

const redisClient = redis.createClient('6379', '127.0.0.1');
// Returns a promise when calling a redis's method
blueBird.promisifyAll(redis.RedisClient.prototype);
blueBird.promisifyAll(redis.Multi.prototype);

redisClient.on('error', (err) => {
    if (err) {
        logger.error(`Redis error occured: ${err}`);
    }
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

module.exports = redisClient;
