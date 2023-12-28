const express = require('express');
const app = express();
const connectionDB = require('./mongoConnection');

// API START HERE
app.use(express.json());

// Connecting to MongoDB
const mongoConnection = new Map();

// API endpoint to connect to MongoDB
app.post('/mongoDB/connect', async (req, res) => {
  try {

    const userId = req.body.userId; // Assuming a unique identifier for each user

    if (!userId) {
      return res.status(400).send('User ID is missing in the request body');
    }

    if (!mongoConnection.has(userId)) {
      const uri = req.body.uri; // Assuming the URI is sent as 'uri' in the request body

      if (!uri) {
        return res.status(400).send('URI is missing in the request body');
      }

      // Connect to MongoDB Atlas for the specific user
      await connectionDB.connectToMongoDB(uri, userId);
      mongoConnection.set(userId, true); // Set the connection status for this user to true
    }
    res.json({ message: 'Connected to MongoDB Atlas' });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error connecting to MongoDB Atlas');
  }
});

// Disconnect from MongoDB
app.post('/mongoDB/disconnect', async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId || !mongoConnection.has(userId)) {
      return res.status(400).send('User ID not found or connection not established');
    }

    await connectionDB.disconnectFromMongoDB();
    mongoConnection.delete(userId);
    res.json({ message: 'Disconnected From Atlas'});
  } catch (e){
    console.error(e);
    res.status(500).send('Unable to Disconnect, Please check your connection!')
  }
});

// Get List of Databases
app.post('/db', async (req, res) => {
  try {
    let list;
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      list = await connectionDB.getListDatabases(userId);
    }
    res.json({list});
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Databases!')
  }
});

// Create Database
app.post('/db/create', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const vDBName = req.body.vDBName;

      if (!vDBName) {
        return res.status(400).send('Database name is required');
      }

      await connectionDB.createDatabase(vDBName, userId);
      return res.json({ message: 'Database Created!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Create Database!');
  }
});

// Remove Database
app.post('/db/remove', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const vDBName = req.body.vDBName;

      if (!vDBName) {
        return res.status(400).send('Database name is required');
      }

      await connectionDB.removeDatabase(vDBName, userId);
      return res.json({ message: 'Database Removed!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Remove Database!');
  }
});

// Select Database
app.post('/db/select', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const vDBName = req.body.vDBName;

      if (!vDBName) {
        return res.status(400).send('Database name is required');
      }

      await connectionDB.selectDatabase(vDBName, userId);
      return res.json({ message: 'Database Selected!'});
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Select Database!');
  }
})

// Get List Collection
app.post('/collection', async (req, res) => {
  try {
    
    let list;
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      list = await connectionDB.getListCollection(userId);
    }
    res.json({list});
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Collections!')
  }
})

// Create Collection
app.post('/collection/create', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      await connectionDB.createACollection(vCollectionName, userId);
      return res.json({ message: 'Collection Created!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Create Collection!');
  }
});

// Remove Collection
app.post('/collection/remove', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      await connectionDB.removeACollection(vCollectionName, userId);
      return res.json({ message: 'Collection Removed!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Remove Collection!');
  }
});

// Select Collection
app.post('/collection/select', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      await connectionDB.selectCollection(vCollectionName, userId);
      return res.json({ message: 'Collection Selected!'});
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Select Collection!');
  }
})

// Get List of Documents in a Collection
app.post('/documents', async (req, res) => {
  try {
    const userId = req.body.userId;
    let documents;
    if (mongoConnection.has(userId)) {
      documents = await connectionDB.getListDocument(userId); 
    }
    res.json({ documents });
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Documents!');
  }
});

// Select Document
app.post('/documents/select', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const pID = req.body.pID; // Assuming the document ID is sent in the request body

      if (!pID) {
        return res.status(400).send('Document ID are required');
      }

      const document = await connectionDB.selectDocument(pID, userId);
      return res.json({ document });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Select Document!');
  }
});

// Remove Document
app.post('/documents/remove', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const pID = req.body.pID; // Assuming the document ID is sent in the request body

      if (!pID) {
        return res.status(400).send('Document ID are required');
      }

      await connectionDB.removeDocument(pID, userId);
      return res.json({ message: 'Document Removed!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Remove Document!');
  }
});

// Update Document
app.post('/documents/update', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const pID = req.body.pID; // Assuming the document ID is sent in the request body
      const pDoc = req.body.pDoc; // Assuming the updated document is sent in the request body

      if (!pID || !pDoc) {
        return res.status(400).send('Document ID and updated document are required');
      }

      await connectionDB.updateDocument(pID, pDoc, userId);
      return res.json({ message: 'Document Updated!' });  
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Update Document!');
  }
});

// Insert Document
app.post('/documents/insert', async (req, res) => {
  try {
    const userId = req.body.userId;
    if (mongoConnection.has(userId)) {
      const pDoc = req.body.pDoc; // Assuming the new document is sent in the request body

      if (!pDoc) {
        return res.status(400).send('New document are required');
      }

      await connectionDB.insertDocument(pDoc, userId);
      return res.json({ message: 'Document Inserted!'});
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Insert Document!');
  }
});

// Server Test
app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});