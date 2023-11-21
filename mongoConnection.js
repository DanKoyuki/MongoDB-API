const { MongoClient, ServerApiVersion } = require('mongodb');

// Helper,
// instance used to take connection setting
// selected_database used to take current working database
// selected_collection used to take current working collection
var instance;
var selected_database;
var selected_collection;


// Connection Section
// connectToMongoDB, create a connection to MongoDB Atlas Cluster using Connection String for node.js
// params@pConnectionString = Connection String
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

// disonnectFromMongoDB, close current connection
async function disconnectFromMongoDB(){
  if (instance!=null) {
    await instance.close() // close connection
  }
}

// Database Section
// getListDatabases, return all database that exist in the cluster
// return@list(db.name)
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

// createDatabase, Create new Database within the Cluster and populate it with dummyCollection
// params@pDBName = Name of Database that will be created
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


// removeDatabase, Remove exist Database along with all collection within that database.
// params@pDBName = Name of Database that will be removed
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

// selectDatabase, Select an existing Database to work with.
// params@pDBName = Name of Database to be selected
async function selectDatabase(pDBName){
  if (instance != null){
    try {
      selected_database = instance.db(pDBName);

      await getListCollection()
    } catch (e) {
      throw e;
    }
  }
}

// unselectDatabase, Beta Function.. Unused..
async function unselectDatabase(){
  if (selected_database != null) {
    try {
      selected_database = null;
    } catch (e) {
      throw e;
    }
  }
}

// Collection Section
// getListCollection, get list of Collection Name that exist within a selected_database
// return@list(collection.name)
async function getListCollection() {
  if (selected_database != null) {
    try {
      const collectionsArray = await selected_database.listCollections().toArray();
      const collectionNames = collectionsArray.map(collection => collection.name);
      console.log('Collections:', collectionNames);
      return collectionNames;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }
}

// createACollection, creating new Collection
// removeACollection, remove existing Collection. This will also remove the Documents with in it.
// selectCollection, select existing Collection to work with.
// params@pCollectionName = Collection Name to be created, removed, selected
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

async function getListDocument(){
  if (selectCollection != null) {
    try {
      const documents = await selected_collection.find()
    } catch (error) {
      throw error 
    }
  }
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  getListDatabases,
  createDatabase,
  removeDatabase,
  selectDatabase,
  unselectDatabase,
  getListCollection,
  createACollection,
  removeACollection,
  selectCollection
};