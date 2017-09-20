const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const appInfo = require('./model/index').appInfo;
const openAPI = require('./model/openAPI');

const api = require('./routes/api/index');
const oauth = require('./routes/Oauth');
const middleware = require('./middleware/index');

const app = new express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.set('jwtTokenSecret',"LuoXia");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());


app.all("*",(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if(req.method=="OPTIONS") res.send(200);
    else next();
  });

app.get('/',(req,res,next)=>{
    let userId;
    if(req.cookies && req.cookies.userId) {
        userId = req.cookies.userId
    } else {
        userId = openAPI.generateUserId();
        res.cookie('userId',userId,{path: '/',expires: new Date(Date.now() + 3600*48)});
    }
    appInfo.getAppByUserId(userId,(err,result)=>{
        if(result) {
            let infos = result;
            infos.scope = infos.scope.split(',');
            return res.render('index',{
                infos
            });
        }
        res.render('index',{
            infos: undefined,
            userId
        })
        
    })
})

app.use('/api',api);
app.use('/Oauth2',oauth);
app.use(middleware.apiErrorHandle);



app.listen(3000,()=>{
    console.log("the OAuth server has been listened at port 3000")
});