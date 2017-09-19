const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const appInfo = require('./model/index').appInfo;

const api = require('./routes/api/index');
const oauth = require('./routes/Oauth');

const app = new express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.set('jwtTokenSecret',"LuoXia");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.all("*",(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if(req.method=="OPTIONS") res.send(200);
    else next();
  });

app.get('/',(req,res,next)=>{
    appInfo.getAppByUserId('laoqiren',(err,result)=>{
        let infos = result || {
            name: '',
            description: '',
            redirectUri: '',
            clientId: '',
            clientSecret: '',
            scope: '',
            homepage: ''
        }
        infos.scope = infos.scope.split(',');
        console.log(infos.scope);
        res.render('index',{
            infos,
            userId: 'laoqiren'
        });
    })
})

app.use('/api',api);
app.use('/Oauth2',oauth);


app.listen(3000,()=>{
    console.log("the OAuth server has been listened at port 3000")
});