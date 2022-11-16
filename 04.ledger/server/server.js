//node.js读取数据
const http = require("http")
const url = require("url")


const MONGO_CLIENT = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// mpx7cvod2iC980R8
const DB_URL = 'mongodb+srv://root:mpx7cvod2iC980R8@cluster0.rdnj9ik.mongodb.net/?retryWrites=true&w=majority';



function connect_db_find_data(MongoClient, dburl, collectionName, res) {
  MongoClient.connect(dburl).then(db => {
    const dbase = db.db("ledger").collection(collectionName)
    dbase.find().toArray().then((result) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'Successful', data: result }));
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
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
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
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }).finally(() => {
      db.close()
    })
  }).catch((err) => {
    if (err) throw err;
  });
}

function connect_db_update_data(MongoClient, dburl, collectionName, res, obj) {
  MongoClient.connect(dburl).then(db => {
    const dbase = db.db("ledger").collection(collectionName)

    dbase.updateOne({_id: ObjectId(obj.id)}, obj.data).then((result) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
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
      if (params.pathname == "/ledger/category") connect_db_find_data(MONGO_CLIENT, DB_URL, 'Category', res)
      if (params.pathname == "/ledger/sub_types") connect_db_find_data(MONGO_CLIENT, DB_URL, 'SubTypes', res)
      if (params.pathname == "/ledger/bill_list") connect_db_find_data(MONGO_CLIENT, DB_URL, 'BillList', res)
      break;

    case 'POST':
      let data = ""
      req.on("data", chunk => { data += chunk })
      req.on("end", () => {
        const dataObj = JSON.parse(data)
        if (params.pathname == "/ledger/bill_list/insert_one") connect_db_inset_data(MONGO_CLIENT, DB_URL, 'BillList', res, dataObj)
        if (params.pathname == "/ledger/bill_list/insert_many") connect_db_inset_data(MONGO_CLIENT, DB_URL, 'BillList', res, dataObj)
        if (params.pathname == "/ledger/bill_list/delete_one:id") connect_db_delete_data(MONGO_CLIENT, DB_URL, 'BillList', res, dataObj)
        if (params.pathname == "/ledger/sub_types/insert_one") connect_db_inset_data(MONGO_CLIENT, DB_URL, 'SubTypes', res, dataObj)
        if (params.pathname == "/ledger/sub_types/delete_one:id") connect_db_delete_data(MONGO_CLIENT, DB_URL, 'SubTypes', res, dataObj)
        if (params.pathname == "/ledger/sub_types/update_one:id") connect_db_update_data(MONGO_CLIENT, DB_URL, 'SubTypes', res, dataObj)
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
