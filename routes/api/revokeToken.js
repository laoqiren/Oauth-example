const authorize = require('../../model/authorize');

module.exports = function(req,res,next){
    authorize.expireToken(req.query.clientId,()=>{
        res.redirect('/')
    })
}