const appInfo = require('../../model/appInfo');

module.exports = function(req,res,next){
    appInfo.deleteAppInfo(req.query.clientId,err=>{
        if(err) {
            console.error(err);
            console.log('删除失败')
            return res.redirect('/');
        }
        console.log('删除成功')
        appInfo.delAppByUserId(req.loginUserId,err=>{
            if(err) {
                console.error(err);
            }
            res.redirect('/');;
        })
    })
}