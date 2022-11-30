const MONGO_CLIENT = require('mongodb').MongoClient;

const DB_URL1 = 'mongodb+srv://root:mpx7cvod2iC980R8@cluster0.rdnj9ik.mongodb.net/?retryWrites=true&w=majority';
const DB_URL2 = 'mongodb://127.0.0.1:27017';

const DB_COLLECTIONS = ['Category', 'SubTypes', 'BillList']

let argv = process.argv[2]
if (argv === '--clone-from-local') {
  console.log('CURRENT-ADDRESS: '+ DB_URL1)
  console.log('CLONE-ADDRESS: '+ DB_URL2)
  dataOperate('CLONE-FROM-LOCAL');
}
if (argv === '--clone-from-remote') {
  console.log('CURRENT-ADDRESS: '+ DB_URL2)
  console.log('CLONE-ADDRESS: '+ DB_URL1)
  dataOperate('CLONE-FROM-REMOTE');
}


async function dataOperate(type) {
  let mongoConn1 = null;
  let mongoConn2 = null;
  const connUrl1 = type === 'CLONE-FROM-REMOTE' ? DB_URL1 : DB_URL2;
  const connUrl2 = type === 'CLONE-FROM-REMOTE' ? DB_URL2 : DB_URL1;

  try {
    const dropThenCreateDB = async () => {
      mongoConn2 = await MONGO_CLIENT.connect(connUrl2);
      console.log('与需备份数据库成功搭线___')
      for (let i = 0; i < DB_COLLECTIONS.length; i++) {
        try {
          await mongoConn2.db("ledger").collection(DB_COLLECTIONS[i]).drop()
        } catch (error) { } finally {
          await mongoConn2.db("ledger").createCollection(DB_COLLECTIONS[i])
        }
      }
      return [];
    }

    const getOriginData = async () => {
      mongoConn1 = await MONGO_CLIENT.connect(connUrl1);
      console.log('与源数据库成功搭线___')
      const originData = [[], [], []];
      const ledgerDB = mongoConn1.db("ledger");
      for (let i = 0; i < DB_COLLECTIONS.length; i++) {
        try {
          originData[i] = await ledgerDB.collection(DB_COLLECTIONS[i]).find().toArray();
        } catch (error) { }
      }
      return originData
    }

    const cloneDB = async (data) => {
      mongoConn2 = await MONGO_CLIENT.connect(connUrl2);
      for (let i = 0; i < DB_COLLECTIONS.length; i++) {
        try {
          const ledgerDB = mongoConn2.db("ledger").collection(DB_COLLECTIONS[i]);
          await ledgerDB.insertMany(data[i]);
        } catch (error) { }
      }
    }

    console.log('准备搞事！！！')
    dropThenCreateDB().then(() => {
      console.log('成功删库可以跑路。。。🤡')
      return getOriginData()
    }).then(originData => {
      console.log('成功获取源数据! collections.length: ', originData.length)
      return cloneDB(originData)
    }).then(() => {
      console.log('克隆成功👉👈。。。')
      if (mongoConn1 != null) mongoConn1.close();
      if (mongoConn2 != null) mongoConn2.close();
      process.exit(1)
    })
  } catch (error) { console.log("错误：" + error) }
}
