const faker = require('faker');
var dataArticles = [];
var secrets = [];

const ARTICLE_NUM = 20;
const SECRET_NUM = 6;


exports.queryArticles = function(userId,callback){
  // 生成文章列表
  let dataArticles = [];
  for (var i = 0; i < ARTICLE_NUM; i++) {
    dataArticles.push({
      id: faker.random.uuid(),
      author: faker.name.findName(),
      title: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      content: faker.lorem.paragraphs(10)
    });
  }
  callback(null,dataArticles);
}

exports.queryUserInfo = function(userId,callback){
  let mockUserInfo = {
    name: userId,
    year: 20,
    school: faker.name.findName()
  }
  callback(null,mockUserInfo);
}

exports.querySecrets = function(userId,callback){
  let mockSecrets = [];
    // 生成秘密
  for (var i = 0; i < SECRET_NUM; i++) {
    secrets.push({
      content: faker.lorem.paragraphs(3)
    });
  }
  callback(null,mockSecrets);
}

exports.generateUserId = function(){
  return faker.name.findName();
}