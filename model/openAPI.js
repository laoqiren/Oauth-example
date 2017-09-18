const faker = require('faker');
var dataArticles = [];

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

exports.queryArticles = function(userId,callback){
  callback(null,mockDatas[userId]);
}

exports.queryUserInfo = function(userId,callback){
  callback(null,mockUsers[userId]);
}