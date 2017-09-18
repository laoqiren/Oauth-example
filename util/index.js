const parseUrl = require('url').parse;
const formatUrl = require('url').format;

let utils = exports

utils.createApiError = function (code, msg) {
    var err = new Error(msg);
    err.error_code = code;
    err.error_message = msg;
    return err;
  };
  
  utils.addQueryParamsToUrl = function (url, params) {
    var info = parseUrl(url, true);
    for (var i in params) {
      info.query[i] = params[i];
    }
    delete info.search;
    return formatUrl(info);
  };

  // 缺少参数错误
  utils.missingParameterError = function (name) {
    return utils.createApiError('MISSING_PARAMETER', '缺少参数`' + name + '`');
  };
  
  // 回调地址不正确错误
  utils.redirectUriNotMatchError = function (url) {
    return utils.createApiError('REDIRECT_URI_NOT_MATCH', '回调地址不正确：' + url);
  };
  
  // 参数错误
  utils.invalidParameterError = function (name) {
    return utils.createApiError('INVALID_PARAMETER', '参数`' + name + '`不正确');
  };
  
  // 超出请求频率限制错误
  utils.outOfRateLimitError = function () {
    return utils.createApiError('OUT_OF_RATE_LIMIT', '超出请求频率限制');
  };
  