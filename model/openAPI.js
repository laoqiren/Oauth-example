const faker = require('faker');
var dataArticles = [];
var secrets = [];

var ARTICLE_NUM = 100;

// 生成文章列表
for (var i = 0; i < 20; i++) {
  dataArticles.push({
    id: faker.random.uuid(),
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    content: faker.lorem.paragraphs(10)
  });
}

// 生成秘密
for (var i = 0; i < 6; i++) {
  secrets.push({
    content: faker.lorem.paragraphs(3)
  });
}

// 用户信息
let mockUsers = {
  laoqiren: {
      name: 'laoqiren',
      year: 20,
      school: 'hdu'
  }
}

let mockDatas = {
  laoqiren: dataArticles
}

let mockSecrets = {
  laoqiren: secrets
}

exports.queryArticles = function(userId,callback){
  callback(null,mockDatas[userId]);
}

exports.queryUserInfo = function(userId,callback){
  callback(null,mockUsers[userId]);
}

exports.querySecrets = function(userId,callback){
  callback(null,mockSecrets[userId]);
}
