# Oauth-example
Oauth example,仿Github Oauth,包括完整的授权流程，注册APP,修改APP信息，自定义并动态改变授权范围，测试客户端等。

## 功能

* 完整的Oauth Server
* 自定义授权范围
* 主动收回token
* 主动删除授权App
* App信息修改
* 高度可定制化
* JWTs token机制，减少DB操作

## 运行流程

**准备**: 安装Server端和Client端依赖，修改Server配置文件(redis相关)，启动Server:

```
npm install
cd client && npm install
redis-server redis.conf
cd .. && npm run server
```

**step1** 访问`localhost:3000`，发现尚未注册任何APP,选择注册第三方APP
![http://7xsi10.com1.z0.glb.clouddn.com/noApps.png](http://7xsi10.com1.z0.glb.clouddn.com/noApps.png)

**step2** 进入`http://localhost:3000/api/registerApp`，进行注册APP
![http://7xsi10.com1.z0.glb.clouddn.com/registerApp.png](http://7xsi10.com1.z0.glb.clouddn.com/registerApp.png)

**step3** 注册成功，返回首页，可查看/修改授权的APP信息
![http://7xsi10.com1.z0.glb.clouddn.com/hasApps.png](http://7xsi10.com1.z0.glb.clouddn.com/hasApps.png)

**step4** 复制上面得到的`clientId`和`clientSecret`，进行客户端配置(`client/config.js`):
```js
exports.appInfo = {
    clientId: '027ea2ee-2182-588a-8203-fbeaa88295a0',
    name: '宇宙最强APP',
    description: '你好啊，我的小可爱！',
    clientSecret: '0144a8eb475a55217c24048388041954',
    redirectUri: '/login/callback'
}
```

**step5** 启动client,访问`localhost:4000`进行授权登录:
```
npm run client
```

![http://7xsi10.com1.z0.glb.clouddn.com/clientLog.png](http://7xsi10.com1.z0.glb.clouddn.com/clientLog.png)

**step6** 获得授权，尝试访问API，上例中，获取用户秘密的API未开放，所以会获取失败
![http://7xsi10.com1.z0.glb.clouddn.com/secretForbbiden.png](http://7xsi10.com1.z0.glb.clouddn.com/secretForbbiden.png)

**step7** 进入Server修改App信息，这里修改授权范围(scope)，开放用户秘密，这会导致该App的token失效，需重新授权，接着再尝试访问秘密API,权限通过。

**step8**注册新App,会导致`clientSecret`,`clientId`变化，需重新配置客户端；删除APP,收回Token，都会导致APP授权失效。


## TODOs

* 单个用户多APP授权管理
* 加入HTTPS
* 优化代码