const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const MY_NAMESPACE = uuidv4();
const utils = require('../util/index');
const jwt = require('jwt-simple');
const moment = require('moment');

// 验证应用的回调URL是否合法
const redisClient = require('./db');
const appDB = require('./appInfo');

 exports.verifyAppRedirectUri = function (clientId, url, callback) {
  appDB.getAppInfo(clientId, function (err, info) {
    if (err) return callback(err);
    if (!info) return callback(utils.invalidParameterError('client_id'));

    callback(null, info.redirectUri === url);
  });
};

exports.generateAuthorizationCode = function (userId, clientId, redirectUri, callback) {
    var code = uuidv5(clientId, MY_NAMESPACE);
    console.log(code)
    redisClient.hmset(code,{
      clientId,
      userId
    },()=>{
      redisClient.expire(code,600,()=>{  // 10分钟后过期
        callback(null, code);
      })
    })
    // dataAuthorizationCode[code] = {
    //   clientId: clientId,
    //   userId: userId
    // };
    
  };
  
  // 删除授权Code
  exports.deleteAuthorizationCode = function (code, callback) {
    //delete dataAuthorizationCode[code];
    redisClient.hdel(code,()=>{
      callback(null, code);
    })
    
  };
  
  
  // 验证授权码是否正确
  exports.verifyAuthorizationCode = function (req,code, clientId, clientSecret, redirectUri, callback) {
    //var info = dataAuthorizationCode[code];
    redisClient.hgetall(code,(err,info)=>{
      if(err) {
        return callback(utils.invalidParameterError('code')); //code会在10分钟后过期，过期后会出错
      }
      if (!info) return callback(utils.invalidParameterError('code'));
      if (info.clientId !== clientId) return callback(utils.invalidParameterError('code'));
    
      appDB.getAppInfo(clientId, function (err, appInfo) {
        if (err) return callback(err);
        if (appInfo.clientSecret !== clientSecret) return callback(utils.invalidParameterError('client_secret'));
        if (appInfo.redirectUri !== redirectUri) return callback(utils.invalidParameterError('redirect_uri'));
        req.scope = appInfo.scope;
        callback(null, info.userId);
      });
    })
    
  };

  // 生成access_token
exports.generateAccessToken = function (req,userId, clientId,redirect_uri, callback) {
  
    //此种方案需要多一层数据库存取，可以改用jwt方案。
    //var code = uuidv5(clientId + userId, MY_NAMESPACE);
    // dataAccessToken[code] = {
    //   clientId: clientId,
    //   userId: userId
    // };
  
    //jwt自包含信息
    let exp = moment().add(1,'days').valueOf();
    let token = jwt.encode({
      userId,
      clientId,
      redirect_uri,
      scope: req.scope,
      exp
    }, req.app.get('jwtTokenSecret'));

    redisClient.hmset(clientId,{
      token,
      expire: 'false'
    },()=>{
      callback(null, token);
    })
  };

// 收回token
exports.expireToken = function(clientId,callback){
  redisClient.hmset(clientId,{
    token: '',
    expire: 'true'
  },()=>{
    callback(null);
  })
}