const openAPI = require('../../model/openAPI');

module.exports = function(req,res,next){
    if(req.scope.indexOf('secret') === -1){
        res.status(401);
        return res.end();
    }
    openAPI.querySecrets(req.userId,(err,secrets)=>{
        res.send(secrets);
    })
}