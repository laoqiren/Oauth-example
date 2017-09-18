const Express = require('express');
const router = Express.Router();
const middlewares = require('../../middleware/index');

const registerApp = require('./registerApp');
const articles = require('./articles');
const userInfo = require('./userInfo');
const revokeToken = require('./revokeToken');
const deleteApp = require('./deleteApp');

router.get('/registerApp',middlewares.ensureLogin,registerApp.getForm);
router.post('/registerApp',middlewares.ensureLogin,registerApp.register);

router.post('/articles',middlewares.verifyAccessToken,articles.getArticles);

router.post('/userInfo',middlewares.verifyAccessToken,userInfo.getUserInfo);

router.get('/revokeToken',middlewares.ensureLogin,revokeToken);

router.get('/deleteApp',middlewares.ensureLogin,deleteApp);


module.exports = router;