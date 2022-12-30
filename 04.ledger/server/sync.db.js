const MONGO_CLIENT = require('mongodb').MongoClient;

const DB_COLLECTIONS = ['Category', 'SubTypes', 'BillList']
const record = {
  status: 'PENDING', // PENDING ON-GOING COMPLETE FAILED
  messages: []
};

async function dataOperate(connUrl1, connUrl2) {
  let mongoConn1 = null;
  let mongoConn2 = null;

  const connectDB = async () => {
    mongoConn1 = await MONGO_CLIENT.connect(connUrl1);
    record.messages.push('与源数据库成功搭线___')

    mongoConn2 = await MONGO_CLIENT.connect(connUrl2);
    record.messages.push('与需备份数据库成功搭线___')
  }

  const dropThenCreateDB = async () => {
    for (let i = 0; i < DB_COLLECTIONS.length; i++) {
      await mongoConn2.db("ledger").collection(DB_COLLECTIONS[i]).drop()
      await mongoConn2.db("ledger").createCollection(DB_COLLECTIONS[i])
    }
  }

  const getOriginData = async () => {
    const originData = [[], [], []];
    const ledgerDB = mongoConn1.db("ledger");
    for (let i = 0; i < DB_COLLECTIONS.length; i++) {
      originData[i] = await ledgerDB.collection(DB_COLLECTIONS[i]).find().toArray();
    }
    return originData
  }

  const cloneDB = async (data) => {
    for (let i = 0; i < DB_COLLECTIONS.length; i++) {
      const ledgerDB = mongoConn2.db("ledger").collection(DB_COLLECTIONS[i]);
      await ledgerDB.insertMany(data[i]);
    }
  }

  record.messages = ['准备搞事！！！']
  record.messages.push('CLONE-ADDRESS: ' + connUrl1)
  record.messages.push('TO-DO ADDRESS: ' + connUrl2)
  record.status = 'ON-GOING'

  connectDB().then(() => {
    return dropThenCreateDB()
  }).then(() => {
    record.messages.push('成功删库可以跑路。。。🤡')
    return getOriginData()
  }).then(originData => {
    record.messages.push('成功获取源数据! collections.length: ' + originData.length)
    return cloneDB(originData)
  }).then(() => {
    record.messages.push('克隆成功👉👈。。。')
    record.status = 'COMPLETE'
    if (mongoConn1 != null) mongoConn1.close();
    if (mongoConn2 != null) mongoConn2.close();
    // process.exit(1)
  }).catch(error => {
    record.messages.push(error.message)
    record.status = 'FAILED';
  }).finally(() => {
    console.log(record)
  })
}

// dataOperate('mongodb://127.0.0.1:27017', 'mongodb://43.139.239.207:27017')

exports.dataOperate = dataOperate
exports.record = record