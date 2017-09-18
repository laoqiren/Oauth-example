const express = require("express");
const path = require("path");
const request = require('superagent');

const app = new express();
const config = require('./config');
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/login',(req,res,next)=>{
    //console.log(req.hostname)
    res.redirect(`${config.apiInfo.apiDomain}${config.apiInfo.getCode}?response_type=code&client_id=${config.appInfo.clientId}&redirect_uri=http://localhost:4000${config.appInfo.redirectUri}`);
    //res.render('login');
})

app.get('/',(req,res,next)=>{
    res.render('index')
});

app.get(config.appInfo.redirectUri,(req,res,next)=>{
    //console.log(req.query.code)
    if(req.query.access_token) {
        //console.log('hei,my godess')
        console.log(req.query.expires_in)
        res.cookie('access_token',req.query.access_token,{

            expires: new Date(Date.now() + req.query.expires_in)
        });
        return res.redirect('/')
    }
    request
        .post(`${config.apiInfo.apiDomain}${config.apiInfo.getToken}`)
        .type('form')
        .send({
            grant_type:'authorization_code',
            code: req.query.code,
            client_id: config.appInfo.clientId,
            client_secret: config.appInfo.clientSecret,
            redirect_uri: `http://localhost:4000${config.appInfo.redirectUri}`
        })
        .end((err,result)=>{
            //console.log(result.body)
            req.user = result.body
            return res.redirect(`${config.appInfo.redirectUri}?access_token=${result.body.access_token}&expires_in=${result.body.expires_in}`)
            //next();
            
            /*
            res.locals.access_token = result.body.access_token;
            res.locals.expires_in = result.body.expires_in;
            res.render('callback');
            */
            
        });
})

app.listen(4000,()=>{
    console.log("the CNode client has been listened at port 4000")
});