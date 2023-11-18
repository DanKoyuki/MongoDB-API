const { MongoClient, ServerApiVersion } = require('mongodb');

var instance;

async function connectToMongoDB(pConnectionString) {
  const client = new MongoClient(pConnectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  instance = client;

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    console.error(e);
  } 

}

async function disconnectFromMongoDB(){
  if (instance!=null) {
    await instance.close() // close connection
  }
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB
};