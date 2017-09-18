const redis = require('redis');

let redisClient = redis.createClient(6379,'127.0.0.1',{no_ready_check: true});

module.exports = redisClient;