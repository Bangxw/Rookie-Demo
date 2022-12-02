const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://127.0.0.1:27017/";


async function deleteMany() {
  let mongoConn;
  try {
    mongoConn = await MongoClient.connect(url)
    const dd = await mongoConn.db("ledger").collection("BillList").deleteMany({
      '_id': { "$in": [ObjectId("638954536ade8f2a68508fbe"), ObjectId("638954536ade8f2a68508fc1")] }
    });
    console.log(dd)
  } catch (error) {
    console.log(error)
  } finally {
    if (mongoConn) mongoConn.close();
  }
}

deleteMany()