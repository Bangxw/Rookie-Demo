//node.js读取数据
const http = require("http")
const url = require("url")

const MONGO_CLIENT = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// mpx7cvod2iC980R8
// const DB_URL = 'mongodb+srv://root:mpx7cvod2iC980R8@cluster0.rdnj9ik.mongodb.net/?retryWrites=true&w=majority';
const DB_URL = 'mongodb://127.0.0.1:27017';



function connect_db_find_data(...rest) {
  handle_mongo_connect(function (dbase) {
    return dbase.find().toArray()
  }, rest, 'FIND')
}

function connect_db_insert_many_data(...rest) {
  let insertObj = rest[3]
  if (!Array.isArray(insertObj)) insertObj = [insertObj]
  console.log(insertObj)
  handle_mongo_connect(function (dbase) {
    return dbase.insertMany(insertObj)
  }, rest, 'INSERT')
}

function connect_db_delete_data(...rest) {
  const whereStr = rest[3]
  handle_mongo_connect(function (dbase) {
    return dbase.deleteOne({ _id: ObjectId(whereStr.id) })
  }, rest, 'DELETE')
}

function connect_db_delete_many_data(...rest) {
  const whereStr = rest[3]
  let ids = whereStr.ids
  if (Array.isArray(ids)) {
    handle_mongo_connect(function (dbase) {
      return dbase.deleteMany({ _id: { '$in': ids.map(id => ObjectId(id)) } })
    }, rest, 'DELETE')
  }
}

function connect_db_update_data(...rest) {
  const payload = rest[3]
  handle_mongo_connect(function (dbase) {
    return dbase.updateOne({ _id: ObjectId(payload.id) }, { $set: payload.data })
  }, rest, 'UPDATE')
}

function handle_mongo_connect(handleDBaseOperate, [MongoClient, dburl, response, payload, collectionName], type) {
  let message = []
  switch (type) {
    case 'FIND': message = ['FIND SUCCESSFUL!', 'FIND ERROR!']; break;
    case 'INSERT': message = ['INSERT SUCCESSFUL!', 'INSERT ERROR!']; break;
    case 'DELETE': message = ['DELETE SUCCESSFUL!', 'DELETE ERROR!']; break;
    case 'UPDATE': message = ['UPDATE SUCCESSFUL!', 'UPDATE ERROR!']; break;
    default: ;
  }

  MongoClient.connect(dburl).then(db => {
    const dbase = db.db("ledger").collection(collectionName)
    handleDBaseOperate(dbase).then(result => {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: message[0], data: result }))
    }).catch(error => {
      console.log('Operate dbase error--------:', error)
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: message[1] }))
    }).finally(() => {
      db.close()
    })
  }).catch((e) => {
    console.log('操作数据库出错-------:', e);
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: '操作数据库出错' }));
  });
}


const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type'); //可以支持的消息首部列表
  response.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS'); //可以支持的提交方式
  response.setHeader('Content-Type', 'application/json;charset=utf-8'); //响应头中定义的类型

  let methods = request.method
  let params = url.parse(request.url, true, true);
  let actualParameter = [MONGO_CLIENT, DB_URL, response, null] // connect_db函数携带的参数集合 最终传递到handle_mongo_connect使用
  console.log("⏳", new Date(), params.pathname, methods);

  switch (methods) {
    case 'GET':
      if (params.pathname === "/ledger/category") connect_db_find_data(...actualParameter, 'Category')
      if (params.pathname === "/ledger/sub_types") connect_db_find_data(...actualParameter, 'SubTypes')
      if (params.pathname === "/ledger/bill_list") connect_db_find_data(...actualParameter, 'BillList')
      break;

    case 'POST':
      let data = ""
      request.on("data", chunk => { data += chunk })
      request.on("end", () => {
        try {
          actualParameter[3] = JSON.parse(data) // request payload
        } catch (error) {
          console.log('Request payload error, 1. Non-json data--------:', error)
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify({ message: 'Request payload error, 1.Non-json data' }))
          return;
        }

        if (params.pathname === "/ledger/bill_list/insert") connect_db_insert_many_data(...actualParameter, 'BillList')
        if (params.pathname === "/ledger/sub_types/insert") connect_db_insert_many_data(...actualParameter, 'SubTypes')
        if (params.pathname === "/ledger/category/insert") connect_db_insert_many_data(...actualParameter, 'Category')

        if (params.pathname === "/ledger/bill_list/delete_one:id") connect_db_delete_data(...actualParameter, 'BillList')
        if (params.pathname === "/ledger/bill_list/delete:ids") connect_db_delete_many_data(...actualParameter, 'BillList')
        if (params.pathname === "/ledger/sub_types/delete_one:id") connect_db_delete_data(...actualParameter, 'SubTypes')
        if (params.pathname === "/ledger/category/delete_one:id") connect_db_delete_data(...actualParameter, 'Category')

        if (params.pathname === "/ledger/bill_list/update_one:id") connect_db_update_data(...actualParameter, 'BillList')
        if (params.pathname === "/ledger/sub_types/update_one:id") connect_db_update_data(...actualParameter, 'SubTypes')
        if (params.pathname === "/ledger/category/update_one:id") connect_db_update_data(...actualParameter, 'Category')
      })
      break;

    case 'OPTION':
      response.writeHead(200)
      response.end('OPTIONS Success!!!')
      break;

    default:
      break;
  }
})

server.listen(8800, function () {
  console.log('server listen at http://127.0.0.1:8800')
})
