const utils = require('../util/index');
const database = require('../model/index');
const jwt = require('jwt-simple');

exports.ensureLogin = function (req, res, next) {
    // 这里直接设置用户ID=glen
    if(!req.cookies.userId){
      res.status(401);
      return res.end('401,please login Oauth Server first');
    }
     req.loginUserId = req.cookies.userId;
     next();
};


// 验证access_token
exports.verifyAccessToken = function (req, res, next) {
  var token = (req.body && req.body.access_token) || req.query.access_token;
  //console.log(token)
  if (token) {
    try {
      var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
      if (decoded.exp < Date.now()) {
        return res.status(401).end('token expires');
        //console.log('过期了')
      }
      //console.log(decoded.userId)
      database.appInfo.getAppInfo(decoded.clientId,(err,info)=>{
        if(!info) {
          return res.status(401).end('no token');
        }
        if(info.expire === 'true'){
          return res.status(401).end('token expires');
        }
        req.userId = decoded.userId;
        req.scope = decoded.scope.split(',');
        //console.log(req.scope)
        next();
      })
    } catch (err) {
      //res.status(401);
      console.log(err)
      return res.status(401).end('bad token');
    }
  } else {
    return res.status(401).end('bad token');
  }
};

// 检查参数
exports.checkAuthorizeParams = function (req, res, next) {
  // 检查参数
  if (!req.query.client_id) {
    return next(utils.missingParameterError('client_id'));
  }
  if (!req.query.redirect_uri) {
    return next(utils.missingParameterError('redirect_uri'));
  }

  // 验证client_id是否正确，并查询应用的详细信息
  database.appInfo.getAppByUserId(req.loginUserId,(err,appInfo)=>{
    if(err || !appInfo || (appInfo.clientId!==req.query.client_id)) return next(utils.invalidParameterError('clientId'));

    req.appInfo = appInfo;
    
        // 验证redirect_uri是否符合该应用设置的回调地址规则
    database.authorize.verifyAppRedirectUri(req.query.client_id, req.query.redirect_uri, function (err, ok) {
      if (err) return next(err);
      if (!ok) {
        return next(utils.redirectUriNotMatchError(req.query.redirect_uri));
      }

      next();
    });
  })
 
};

// 统一处理API出错信息
exports.apiErrorHandle = function (err, req, res, next) {
  console.error((err && err.stack) || err.toString());

  // 如果有res.apiError()则使用其来输出出错信息
  if (typeof res.apiError === 'function') {
    return res.apiError(err);
  }

  next();
};