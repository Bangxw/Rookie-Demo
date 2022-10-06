//node.js读取数据
const http = require("http")
const url = require("url")


const MONGO_CLIENT = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const DB_URL = 'mongodb://127.0.0.1:27017/ledger';



function connect_db_get_data(MongoClient, dburl, collectionName, res) {
  MongoClient.connect(dburl).then(db => {
    const dbase = db.db("ledger").collection(collectionName)
    dbase.find().toArray().then((result) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 1, data: result }));
    }).finally(() => {
      db.close()
    })
  }).catch((err) => {
    if (err) throw err;
  });
}

function connect_db_inset_data(MongoClient, dburl, collectionName, res, insetObj) {
  MongoClient.connect(dburl).then(db => {
    const dbase = db.db("ledger").collection(collectionName)
    dbase.insertOne(insetObj).then((result) => {
      console.log('文档插入成功')
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 1 }));
    }).finally(() => {
      db.close()
    })
  }).catch((err) => {
    if (err) throw err;
  });
}

function connect_db_delete_data(MongoClient, dburl, collectionName, res, whereStr) {
  MongoClient.connect(dburl).then(db => {
    const dbase = db.db("ledger").collection(collectionName)

    
    dbase.deleteOne({_id: ObjectId(whereStr.id)}).then((result) => {
      console.log(result)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 1 }));
    }).finally(() => {
      db.close()
    })
  }).catch((err) => {
    if (err) throw err;
  });
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type'); //可以支持的消息首部列表
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS'); //可以支持的提交方式
  res.setHeader('Content-Type', 'application/json;charset=utf-8'); //响应头中定义的类型

  let methods = req.method
  let params = url.parse(req.url, true, true);
  console.log("⏳", new Date(), params.pathname, methods);

  switch (methods) {
    case 'GET':
      if (params.pathname == "/ledger/list") connect_db_get_data(MONGO_CLIENT, DB_URL, 'datailBillList', res)
      if (params.pathname == "/ledger/tags") connect_db_get_data(MONGO_CLIENT, DB_URL, 'classificationTags', res)
      break;

    case 'POST':
      let data = ""
      req.on("data", chunk => { data += chunk })
      req.on("end", () => {
        const dataObj = JSON.parse(data)
        if (params.pathname == "/ledger/list/insert_one") connect_db_inset_data(MONGO_CLIENT, DB_URL, 'datailBillList', res, dataObj)
        if (params.pathname == "/ledger/list/insert_many") connect_db_inset_data(MONGO_CLIENT, DB_URL, 'datailBillList', res, dataObj)
        if (params.pathname == "/ledger/list/delete_one:id") connect_db_delete_data(MONGO_CLIENT, DB_URL, 'datailBillList', res, dataObj)
        if (params.pathname == "/ledger/tags/insert_one") connect_db_inset_data(MONGO_CLIENT, DB_URL, 'classificationTags', res, dataObj)
        if (params.pathname == "/ledger/tags/delete_one:id") connect_db_delete_data(MONGO_CLIENT, DB_URL, 'classificationTags', res, dataObj)
      })
      break;

    case 'OPTION':
      res.writeHead(200)
      res.end('OPTIONS Success!!!')
      break;

    default:
      break;
  }
})

server.listen(8800, function () {
  console.log('server listen at http://127.0.0.1:8800')
})
