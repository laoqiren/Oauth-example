const appInfo = require('../../model/index').appInfo;
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

exports.getForm = function(req,res,next){
    appInfo.getAppByUserId('laoqiren',(err,info)=>{
        let infos = info || {
            name: '',
            description: '',
            redirectUri: '',
            clientId: '',
            clientSecret: '',
            scope: ''
        }
       // console.log(infos.description)
        res.render('addApp',{
            infos
        });
    })
    
}

exports.register = function(req,res,next){
    let MY_NAMESPACE = uuidv4();
    let {appName,description,redirectUri,scope,clientId} = req.body;
    //console.log(redirectUri)
    //scope = scope.join(',');
    let info = {
        name: appName,
        description,
        redirectUri,
        scope
    }
    console.log(scope)
    appInfo.getAppInfo(clientId,(err,result)=>{
        if(result) {
            info.clientSecret = result.clientSecret;
            info.clientId = result.clientId;
            
            if(Array.isArray(scope)){
                scope = scope.join(',');
            }
            // 如果修改了权限范围，就收回token重新授权
            if(result.scope !== scope){
                info.token = '';
                info.expire = 'true';
            }
        } else {
            let MY_NAMESPACE = uuidv4();
            info.clientId = uuidv5(Date.now().toString(), MY_NAMESPACE);
            info.clientSecret = crypto.createHash('md5').update(clientId).digest('hex');
        }
        appInfo.addAppInfo(info,err=>{
            console.log('注册第三方应用成功！');
            res.redirect('/')
        })
    })
}