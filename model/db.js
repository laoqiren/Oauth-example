const redis = require('redis');
const config = require('../config').db;

let redisClient = redis.createClient(config.port,config.host,{
    no_ready_check: true,
    password: config.password
});

redisClient.on('connect',()=>{
    console.log('the server has connected to the redis server successfully!')
})

module.exports = redisClient;