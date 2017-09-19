const redisClient = require('./db');

exports.getAppInfo = function (id, callback) {
    redisClient.hgetall(id,(err,info)=>{
      if(err) return callback(err);
      callback(null,info);
    })
  };

exports.deleteAppInfo = function(clientId,callback){
  redisClient.del(clientId,err=>{
    if(err) {
      return callback(err)
    }
    console.log(clientId)
    callback(null)
  })
}

exports.addAppInfo = function(info,callback){
   redisClient.hmset(info.clientId,info,()=>{
     
     redisClient.set('laoqiren',info.clientId,()=>{
      callback(null);
     });
   })
}

exports.getAppByUserId = function(userId,callback){
  redisClient.get(userId,(err,clientId)=>{
    if(err) return callback(err);
    redisClient.hgetall(clientId,(err,info)=>{
      if(err) return rcallback(err);
      callback(null,info)
    })
  })
}

exports.getClientIdByUser = function(userId,cb){
  redisClient.get(userId,(err,clientId)=>{
    cb(null,clientId);
  })
}

exports.delAppByUserId = function(userId,callback){
  redisClient.del(userId,err=>{
    if(err) {
      return callback(err);
    }
    callback(null)
  })
}