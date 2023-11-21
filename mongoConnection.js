const { MongoClient, ServerApiVersion } = require('mongodb');

// Helper
var instance;
var selected_database;
var selected_collection;

// Connection Section

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

// Database Section

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
      const db = await instance.db(pDBName);

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
      const db = await instance.db(pDBName);

      await db.dropDatabase();
    } catch (error) {
      console.error('Error removing database:', error);
      throw error;
    }
  }
}

async function selectDatabase(pDBName){
  if (instance != null){
    try {
      selected_database = instance.db(pDBName);
    } catch (e) {
      throw e;
    }
  }
}

// Collection Section

async function getListCollection() {
  if (selected_database != null) {
    try {
      const collections = instance.db("Belajar").listCollections().toArray();
      // const collections = selected_database.listCollections().toArray();
      console.log('Collections:', collections); // Log the collection names
      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }
}

async function createACollection(pCollectionName){
  if (selected_database != null) {
    try{
      await selected_database.createCollection(pCollectionName);
    } catch(err) {
      throw err
    }
  }
}

async function removeACollection(pCollectionName){
  if (selected_database != null) {
    try{
      await selected_database.dropCollection(pCollectionName);
    } catch(err) {
      throw err
    }
  }
}

async function selectCollection(pCollectionName){
  if (selected_database != null){
    try {
      selected_collection = selected_database.collection(pCollectionName);
    } catch (error) {
      throw error
    }
  }
}

// Document Section

// async function getListDocument(){
//   if (selectCollection != null) {
//     try {
//       const documents = await selected_collection.
//     } catch (error) {
//       throw error 
//     }
//   }
// }

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  getListDatabases,
  createDatabase,
  removeDatabase,
  selectDatabase,
  getListCollection,
  createACollection,
  removeACollection,
  selectCollection
};