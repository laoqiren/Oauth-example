const appInfo = require('../../model/index').appInfo;
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

exports.getForm = function(req,res,next){
    res.render('addApp');
}

exports.register = function(req,res,next){
    let {appName,description,redirectUri,scope,homepage} = req.body;
    //console.log(redirectUri)
    //scope = scope.join(',');
    let info = {
        name: appName,
        description,
        redirectUri,
        homepage,
        scope
    }   
    let MY_NAMESPACE = uuidv4();
    info.clientId = uuidv5(Date.now().toString(), MY_NAMESPACE);
    info.clientSecret = crypto.createHash('md5').update(info.clientId).digest('hex');
        
    appInfo.addAppInfo(info,err=>{
        console.log('注册第三方应用成功！');
        res.redirect('/')
    })
    
}