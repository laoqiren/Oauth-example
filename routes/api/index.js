const Express = require('express');
const router = Express.Router();
const middlewares = require('../../middleware/index');

const registerApp = require('./registerApp');
const articles = require('./articles');
const secrets = require('./secret');
const userInfo = require('./userInfo');
const revokeToken = require('./revokeToken');
const deleteApp = require('./deleteApp');
const modifyApp = require('./modifyApp');

router.get('/registerApp',middlewares.ensureLogin,registerApp.getForm);
router.post('/registerApp',middlewares.ensureLogin,registerApp.register);

router.post('/articles',middlewares.verifyAccessToken,articles.getArticles);

router.post('/userInfo',middlewares.verifyAccessToken,userInfo.getUserInfo);

router.get('/revokeToken',middlewares.ensureLogin,revokeToken);

router.get('/deleteApp',middlewares.ensureLogin,deleteApp);

router.post('/modifyApp',middlewares.ensureLogin,modifyApp);

router.post('/secrets',middlewares.verifyAccessToken,secrets);


module.exports = router;