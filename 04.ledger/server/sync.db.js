const MONGO_CLIENT = require('mongodb').MongoClient;
const PROMPT_SYNC = require('prompt-sync')();


const DB_COLLECTIONS = ['Category', 'SubTypes', 'BillList']


async function dataOperate() {
  let mongoConn1 = null;
  let mongoConn2 = null;

  const connectDB = async () => {
    let connUrl1 = PROMPT_SYNC('👉请输入源数据库地址: ');
    let connUrl2 = PROMPT_SYNC('👉请输入待克隆地址: ');

    mongoConn1 = await MONGO_CLIENT.connect(connUrl1);
    console.log('  与源数据库成功搭线___')
    mongoConn2 = await MONGO_CLIENT.connect(connUrl2);
    console.log('  与待克隆数据库成功搭线___')
  }

  const dropThenCreateDB = async () => {
    let confirm = PROMPT_SYNC('⚠️待克隆数据库将被覆盖，此操作无法恢复，建议备份原有数据，确认是否继续(y/n):')
    if (!confirm || (confirm.toUpperCase() !== 'Y' && confirm.toUpperCase() !== 'YES')) {
      process.exit(1);
    }
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



  console.log('准备搞事！！！\n------------------------')
  connectDB().then(() => {
    return dropThenCreateDB()
  }).then(() => {
    console.log('  成功删库可以跑路。。。🤡')
    return getOriginData()
  }).then(originData => {
    console.log('  成功获取源数据! collections.length: ' + originData.length)
    return cloneDB(originData)
  }).then(() => {
    console.log('  克隆成功👉👈')
    if (mongoConn1 != null) mongoConn1.close();
    if (mongoConn2 != null) mongoConn2.close();
    // process.exit(1)
  }).catch(error => {
    console.log(error.message)
  })
}

dataOperate()