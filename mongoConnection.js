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

async function getListDatabases(){
  if (instance != null) {
    try {
      const databases = await instance.db().admin().listDatabases(); // Call listDatabases() with parentheses
      return databases.databases.map(db => db.name); // Extract only the database names
    } catch (error) {
      console.error('Error fetching databases:', error);
      throw error;
    }
  }
  return []; // Return an empty array if instance is null
}

async function createDatabase(pDBName){
  if (instance != null) {
    try {
      const db = await instance.db(pDBName) 

      await db.createCollection('dummyCollection');

    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }
}

async function removeDatabase(pDBName){
  if (instance != null) {
    try {
      const db = instance.db(pDBName)

      await db.dropDatabase();
    } catch (error) {
      console.error('Error removing database:', error);
      throw error;
    }
  }
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  getListDatabases,
  createDatabase,
  removeDatabase
};