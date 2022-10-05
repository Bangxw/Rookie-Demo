const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/runoob';

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log('数据库连接成功!');

  const dbase = db.db("runoob");

  // // 创建集合
  // dbase.createCollection('site', function (err, res) {
  //   if (err) throw err;
  //   console.log("创建集合!");
  //   db.close();
  // });

  // // 新增一条数据
  // let myObj = { name: '菜鸟教程', url: 'www.runoob' }
  // dbase.collection('site').insertOne(myObj, function (err, res) {
  //   if (err) throw err;
  //   console.log('文档插入成功')
  //   db.close();
  // })

  // // 新增多条数据
  // let myObjs = [
  //   { name: '菜鸟工具', url: 'https://c.runoob.com', type: 'cn' },
  //   { name: 'Google', url: 'https://www.google.com', type: 'en' },
  //   { name: 'Facebook', url: 'https://www.google.com', type: 'en' },
  // ]
  // dbase.collection('site').insertMany(myObjs, function(err, res) {
  //   if(err) throw err;
  //   console.log('插入的文档数量为：' + res.insertedCount)
  //   db.close()
  // })

  // // 更新一条数据
  // const wherestr = { name: '菜鸟教程' }; // 查询条件
  // let updateStr = { $set: { "url": "https://www.runoob.com" } };
  // dbase.collection('site').updateOne(wherestr, updateStr, function (err, result) {
  //   if (err) throw err;
  //   console.log(result)
  //   db.close()
  // })

  // // 更新多条数据
  // const whereStr = { type: 'en' };
  // let updateStr = { $set: { "url": 'https://www.runoob.com' } }
  // dbase.collection('site').updateMany(whereStr, updateStr, function (err, result) {
  //   if (err) throw err;
  //   console.log(result)
  //   db.close()
  // })


  // // 删除数据
  // const whereStr = { 'name': '菜鸟教程' }; // 查询条件
  // dbase.collection('site').deleteOne(whereStr, function (err, obj) {
  //   if (err) throw err;
  //   console.log('文档删除成功')
  //   db.close()
  // })

  // // 删除多条数据
  // const whereStr = { type: 'en' };
  // dbase.collection('site').deleteMany(whereStr, function (err, obj) {
  //   if (err) throw err;
  //   console.log(obj)
  //   db.close()
  // })

  // // 排序
  // const mySort = { type: 1 }  // 按type字段升序
  // dbase.collection('site').find().sort(mySort).toArray(function (err, result) {
  //   if (err) throw err;
  //   console.log(result)
  //   db.close()
  // })


  // // 查询分页 limit读取指定条数的数据
  // dbase.collection('site').find().limit(2).toArray(function (err, result) {
  //   if (err) throw err;
  //   console.log(result)
  //   db.close()
  // })
  // dbase.collection('site').find().skip(2).limit(2).toArray(function (err, result) {
  //   if (err) throw err;
  //   console.log(result)
  //   db.close()
  // })


  // // 删除集合
  // dbase.collection('site').drop(function (err, delOK) {
  //   if (err) throw err;
  //   if (delOK) console.log('集合已经删除')
  //   db.close()
  // })
});

http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/#create-the-package-json-file