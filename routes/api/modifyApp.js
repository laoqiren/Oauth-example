const appInfo = require('../../model/appInfo');

module.exports = function(req,res,next){
    let {appName,description,redirectUri,scope} = req.body;
    //console.log(redirectUri)
    //scope = scope.join(',');
    let info = {
        name: appName,
        description,
        redirectUri,
        scope
    }
   // console.log(scope)
    appInfo.getAppByUserId(req.loginUserId,(err,result)=>{
        if(result) {
            info.clientSecret = result.clientSecret;
            info.clientId = result.clientId;
            
            if(Array.isArray(scope)){
                scope = scope.join(',');
            }
            // 如果修改了权限范围，就收回token重新授权
            if(result.scope !== scope){
                console.log("权限变化")
                info.token = '';
                info.expire = 'true';
            }
        }
        appInfo.addAppInfo(info,err=>{
            console.log('修改应用信息成功！');
            res.redirect('/')
        })
    })
}