const Express = require('express');
const router = Express.Router();
const middlewares = require('../middleware/index');
const authorize = require('../model/index').authorize;
const utils = require('../util/index');

function generateAuthorizationCode(req,res,next){
  authorize.generateAuthorizationCode(req.loginUserId, req.query.client_id, req.query.redirect_uri, function (err, ret) {
    if (err) return next(err);

    // 跳转回来源应用
    res.redirect(utils.addQueryParamsToUrl(req.query.redirect_uri, {
      code: ret
    }));
  });
}

router.get('/authorize', middlewares.ensureLogin, middlewares.checkAuthorizeParams, function (req, res, next) {
    //res.cookie("name","luoxia");
    res.locals.loginUserId = req.loginUserId;
    res.locals.appInfo = req.appInfo;
    res.render('authorize');
  });


router.post('/authorize', middlewares.ensureLogin, middlewares.checkAuthorizeParams,generateAuthorizationCode);


router.post('/access_token', function (req, res, next) {
  // 检查参数
  var client_id = req.body.client_id || req.query.client_id;
  var client_secret = req.body.client_secret || req.query.client_secret;
  var redirect_uri = req.body.redirect_uri || req.query.redirect_uri;
  var code = req.body.code || req.query.code;
  //console.log(`the code from client: ${code}`)
  if (!client_id) return next(utils.missingParameterError('client_id'));
  if (!client_secret) return next(utils.missingParameterError('client_secret'));
  if (!redirect_uri) return next(utils.missingParameterError('redirect_uri'));
  if (!code) return next(utils.missingParameterError('code'));

  // 验证authorization_code
  authorize.verifyAuthorizationCode(req,code, client_id, client_secret, redirect_uri, function (err, userId) {
    if (err) return next(err);

    // 生成access_token
    authorize.generateAccessToken(req,userId, client_id, redirect_uri, function (err, accessToken) {
      if (err) return next(err);

      // 生成access_token后需要删除旧的authorization_code
      authorize.deleteAuthorizationCode(code, function (err) {
        if (err) console.error(err);
      });

      res.json({
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 3600 * 24, // access_token的有效期为1天
        scope: req.scope
      });
    });
  });
}
);

module.exports = router;