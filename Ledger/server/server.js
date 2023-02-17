/* eslint-disable no-console */
// const express = require('express');

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(8800, () => {
//   console.log('server listen at http://127.0.0.1:8800!');
// });

// return;

const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const DB_URL = 'mongodb://127.0.0.1:27017';
const COLLECTION_BILLLIST = 'billlist';
const COLLECTION_CATEGORY = 'category';
const COLLECTION_SUBTYPES = 'subtypes';

function handle_mongo_connect(handleDBaseOperate, [
  collectionName, response,
], type) {
  let message = [];
  switch (type) {
    case 'FIND': message = ['FIND SUCCESSFUL!', 'FIND ERROR!']; break;
    case 'INSERT': message = ['INSERT SUCCESSFUL!', 'INSERT ERROR!']; break;
    case 'DELETE': message = ['DELETE SUCCESSFUL!', 'DELETE ERROR!']; break;
    case 'UPDATE': message = ['UPDATE SUCCESSFUL!', 'UPDATE ERROR!']; break;
    default:
  }

  MongoClient.connect(DB_URL).then((db) => {
    const dbase = db.db('ledger').collection(collectionName);
    handleDBaseOperate(dbase).then((result) => {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: message[0], data: result }));
    }).catch((error) => {
      console.log('Operate dbase error--------:', error);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: message[1] }));
    }).finally(() => {
      db.close();
    });
  }).catch((e) => {
    console.log('操作数据库出错-------:', e);
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: '操作数据库出错' }));
  });
}

function connect_db_find_data(...rest) {
  handle_mongo_connect((dbase) => dbase.find().toArray(), rest, 'FIND');
}

function connect_db_insert_many_data(...rest) {
  let insertObj = rest[2];
  if (!Array.isArray(insertObj)) insertObj = [insertObj];
  handle_mongo_connect((dbase) => dbase.insertMany(insertObj), rest, 'INSERT');
}

function connect_db_delete_data(...rest) {
  const whereStr = rest[2];
  handle_mongo_connect((dbase) => dbase.deleteOne({ _id: ObjectId(whereStr.id) }), rest, 'DELETE');
}

function connect_db_delete_many_data(...rest) {
  const whereStr = rest[2];
  const { ids } = whereStr;
  if (Array.isArray(ids)) {
    handle_mongo_connect((dbase) => dbase.deleteMany({ _id: { $in: ids.map((id) => ObjectId(id)) } }), rest, 'DELETE');
  }
}

function connect_db_update_data(...rest) {
  const payload = rest[2];
  console.log(payload);
  handle_mongo_connect((dbase) => dbase.updateOne({ _id: ObjectId(payload.id) }, { $set: payload.data }), rest, 'UPDATE');
}

const server = http.createServer((request, response) => {
  // response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type'); // 可以支持的消息首部列表
  response.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS'); // 可以支持的提交方式
  response.setHeader('Content-Type', 'application/json;charset=utf-8'); // 响应头中定义的类型

  let data = '';
  const { method, url: rUrl } = request;
  const { pathname } = url.parse(rUrl, true, true); // params
  const actualParameter = [response]; // connect_db函数携带的参数集合 最终传递到handle_mongo_connect使用
  console.log('⏳', new Date(), pathname, method);

  switch (method) {
    case 'GET':
      if (pathname === '/ledger/category') connect_db_find_data(COLLECTION_CATEGORY, ...actualParameter);
      if (pathname === '/ledger/subtypes') connect_db_find_data(COLLECTION_SUBTYPES, ...actualParameter);
      if (pathname === '/ledger/billlist') connect_db_find_data(COLLECTION_BILLLIST, ...actualParameter);
      break;

    case 'POST':
      request.on('data', (chunk) => { data += chunk; });
      request.on('end', () => {
        try {
          actualParameter[1] = JSON.parse(data); // request payload
        } catch (error) {
          console.log('Request payload error, 1. Non-json data--------:', error);
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ message: 'Request payload error, 1.Non-json data' }));
          return;
        }

        // INSERT DATA
        if (pathname === '/ledger/billlist/insert') connect_db_insert_many_data(COLLECTION_BILLLIST, ...actualParameter);
        if (pathname === '/ledger/subtypes/insert') connect_db_insert_many_data(COLLECTION_SUBTYPES, ...actualParameter);
        if (pathname === '/ledger/category/insert') connect_db_insert_many_data(COLLECTION_CATEGORY, ...actualParameter);

        //  DELETE DATA
        if (pathname === '/ledger/billlist/delete_one:id') connect_db_delete_data(COLLECTION_BILLLIST, ...actualParameter);
        if (pathname === '/ledger/billlist/delete:ids') connect_db_delete_many_data(COLLECTION_BILLLIST, ...actualParameter);
        if (pathname === '/ledger/subtypes/delete_one:id') connect_db_delete_data(COLLECTION_SUBTYPES, ...actualParameter);
        if (pathname === '/ledger/category/delete_one:id') connect_db_delete_data(COLLECTION_CATEGORY, ...actualParameter);

        // UPDATE DATA
        if (pathname === '/ledger/billlist/update_one:id') connect_db_update_data(COLLECTION_BILLLIST, ...actualParameter);
        if (pathname === '/ledger/subtypes/update_one:id') connect_db_update_data(COLLECTION_SUBTYPES, ...actualParameter);
        if (pathname === '/ledger/category/update_one:id') connect_db_update_data(COLLECTION_CATEGORY, ...actualParameter);
      });
      break;

    case 'OPTION':
      response.writeHead(200);
      response.end('OPTIONS Success!!!');
      break;

    default:
      break;
  }
});

server.listen(8800, () => {
  console.log('server listen at http://127.0.0.1:8800');
});
