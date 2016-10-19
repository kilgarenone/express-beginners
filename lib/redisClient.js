const logger = require('./logger.js');
const blueBird = require('bluebird');
const redis = require('redis');

const redisClient = redis.createClient('6379', '127.0.0.1');

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
