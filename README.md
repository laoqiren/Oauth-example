# Oauth-example
Oauth example

## 功能

* 完整的Oauth Server
* 自定义授权范围
* 主动收回token
* 主动删除授权App
* App信息修改
* 高度可定制化

## 运行

### Oauth Server

#### 安装依赖

```
npm install
```

#### 启动redis

```
redis-server redis.conf
```

#### 注册/修改App:`http://localhost:3000/api/registerApp`

#### 查看已授权App信息: `http://localhost:3000/`

### Client

#### 安装依赖

```
cd client && npm install
```

#### 访问`http://localhost:4000/`


## tips

* 修改app信息时，如果scope发生变化，会使得重新授权发生
* 可通过client在不同scope下的行为测试功能
