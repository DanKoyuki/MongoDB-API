const { MongoClient, ServerApiVersion } = require('mongodb');

// Helper,
// instance used to take connection setting
// selected_database used to take current working database
// selected_collection used to take current working collection
const connection = new Map(); // new Version of instance
const userDatabase = new Map(); // new Version of selected_database
const userCollection = new Map(); // new Version of selected_collection

// Connection Section
// connectToMongoDB, create a connection to MongoDB Atlas Cluster using Connection String for node.js
// params@pConnectionString = Connection String
// params@pUserId = user connected to the app
async function connectToMongoDB(pConnectionString, pUserId) {
  const client = new MongoClient(pConnectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  connection.set(pUserId, client);
  
  try {
    // Connect to the MongoDB cluster
    await connection.get(pUserId).connect();

    // Make the appropriate DB calls
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    console.error(e);
  } 

}

// disonnectFromMongoDB, close current connection
async function disconnectFromMongoDB(pUserId){
  if (connection.has(pUserId)) {
    await connection.get(pUserId).close();
    connection.delete(pUserId);
  }
}

// Database Section
// getListDatabases, return all database that exist in the cluster
// return@list(db.name)
async function getListDatabases(pUserId){
  if (connection.has(pUserId)) {
    try {
      const databases = await connection.get(pUserId).db().admin().listDatabases(); // Call listDatabases() with parentheses
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
async function createDatabase(pDBName, pUserId){
  if (connection.has(pUserId)) {
    try {
      const db = await connection.get(pUserId).db(pDBName);

      await db.createCollection('dummyCollection');

    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }
}


// removeDatabase, Remove exist Database along with all collection within that database.
// params@pDBName = Name of Database that will be removed
async function removeDatabase(pDBName, pUserId){
  if (connection.has(pUserId)) {
    try {
      const db = await connection.get(pUserId).db(pDBName);

      await db.dropDatabase();
    } catch (error) {
      console.error('Error removing database:', error);
      throw error;
    }
  }
}

// selectDatabase, Select an existing Database to work with.
// params@pDBName = Name of Database to be selected
async function selectDatabase(pDBName, pUserId) {
  if (connection.has(pUserId)) {
    if (userDatabase.has(pUserId)) {
      try {
        // Clean the previous selection
        userDatabase.delete(pUserId);
      } catch (e) {
        throw e;
      }
    }
    
    try {
      // Populate selected_database with the user selection from frontend
      const selected_database = connection.get(pUserId).db(pDBName);
      userDatabase.set(pUserId, selected_database)
    } catch (e) {
      throw e;
    }
  }
}

// Collection Section
// getListCollection, get list of Collection Name that exist within a selected_database
// return@list(collection.name)
async function getListCollection(pUserId) {
  if (userDatabase.has(pUserId)) {
    try {
      const collectionsArray = await userDatabase.get(pUserId).listCollections().toArray();
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
async function createACollection(pCollectionName, pUserId){
  if (userDatabase.has(pUserId)) {
    try{
      await userDatabase.get(pUserId).createCollection(pCollectionName);
    } catch(err) {
      throw err
    }
  }
}

async function removeACollection(pCollectionName, pUserId){
  if (userDatabase.has(pUserId)) {
    try{
      await userDatabase.get(pUserId).dropCollection(pCollectionName);
    } catch(err) {
      throw err
    }
  }
}

async function selectCollection(pCollectionName, pUserId){

  if (userDatabase.has(pUserId)) {
    if (userCollection.has(pUserId)) {
      try {
        // Clean the previous selection
        userCollection.delete(pUserId);
      } catch (e) {
        throw e;
      }
    }
    
    try {
      // Populate selected_collection with the user selection from frontend
      const selected_collection = userDatabase.get(pUserId).collection(pCollectionName);
      userCollection.set(pUserId, selected_collection);
    } catch (e) {
      throw e;
    }
  }

}

// Document Section

async function getListDocument(pUserId){
  if (userCollection.has(pUserId)) {
    try {
      const documents = await userCollection.get(pUserId).find().toArray();
      const documentIds = documents.map(doc => doc._id);
      return documentIds;
    } catch (error) {
      throw error;
    }
  }
}

async function selectDocument(pID, pUserId){
  if (userCollection.has(pUserId)) {
    try {
      const query = {_id : pID};
      const doc = await userCollection.get(pUserId).findOne(query);
      return doc; 
    } catch (error) {
      throw error;
    }
  }
}

async function removeDocument(pID, pUserId){
  if (userCollection.has(pUserId)) {
    try {
      const query = {_id : pID};
      await userCollection.get(pUserId).deleteOne(query);
      console.log("Document Removed!")
    } catch (error) {
      throw error;
    }
  }
}

async function updateDocument(pID, pDoc, pUserId){
  if (userCollection.has(pUserId)) {
    try {
      const filter = {_id : pID};
      const options = {upsert : true};
      const updateDocs = {
        $set: pDoc
      };
      
      await userCollection.get(pUserId).updateOne(filter, updateDocs, options);
      console.log("Document Updated");
    } catch (error) {
      throw error;
    }
  }
}

async function insertDocument(pDoc, pUserId){
  if (userCollection.has(pUserId)) {
    try {
      await userCollection.get(pUserId).insertOne(pDoc);
    } catch (error) {
      throw error;
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
  getListCollection,
  createACollection,
  removeACollection,
  selectCollection,
  getListDocument,
  selectDocument,
  removeDocument,
  updateDocument,
  insertDocument
};