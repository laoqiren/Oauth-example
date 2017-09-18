const openAPI = require('../../model/index').openAPI;

exports.getArticles = function(req,res,next){
    if(req.scope.indexOf('articles') === -1){
        res.status(401);
        return res.end();
    }
    openAPI.queryArticles(req.userId,(err,articles)=>{
        res.status(200);
        res.send(articles);
    })
}