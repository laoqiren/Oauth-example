const openAPI = require('../../model/openAPI');

exports.getUserInfo = function(req,res,next){
    // 默认允许获取用户信息
    /*
    if(req.scope.indexOf('userInfo') === -1){
        res.status(401);
        return res.end();
    }
    */
    openAPI.queryUserInfo(req.userId,(err,info)=>{
        res.status(200);
        res.send(info);
    })
    
}