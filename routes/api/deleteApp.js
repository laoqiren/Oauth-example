const appInfo = require('../../model/appInfo');

module.exports = function(req,res,next){
    appInfo.deleteAppInfo(req.query.clientId,()=>{
        appInfo.delAppByUserId(req.loginUserId,()=>{
            res.redirect('/')
        })
    })
}