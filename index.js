const express = require('express');
const app = express();
const connectionDB = require('./mongoConnection');

// API START HERE
app.use(express.json());

// Connecting to MongoDB
let mongoConnected = false; // Flag to check MongoDB connection status

// API endpoint to connect to MongoDB
app.post('/connectToMongoDB', async (req, res) => {
  try {
    if (!mongoConnected) {
      const uri = req.body.uri; // Assuming the URI is sent as 'uri' in the request body

      if (!uri) {
        return res.status(400).send('URI is missing in the request body');
      }

      // Connect to MongoDB Atlas if not already connected
      await connectionDB.connectToMongoDB(uri);
      mongoConnected = true;
    }
    res.json({ message: 'Connected to MongoDB Atlas' });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error connecting to MongoDB Atlas');
  }
});

// Disconnect from MongoDB
app.post('/disconnectFromMongoDB', async (req, res) => {
  try {
    if (mongoConnected) {
      await connectionDB.disconnectFromMongoDB();
      mongoConnected = false;
    }
    res.json({ message: 'Disconnected From Atlas'});
  } catch (e){
    console.error(e);
    res.status(500).send('Unable to Disconnect, Please check your connection!')
  }
});

// Get List of Databases
app.post('/getDatabases', async (req, res) => {
  try {
    let list;
    if (mongoConnected) {
      list = await connectionDB.getListDatabases();
    }
    res.json({list});
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Databases!')
  }
});

// Create Database
app.post('/createDatabase', async (req, res) => {
  try {
    if (mongoConnected) {
      const vDBName = req.body.vDBName;

      if (!vDBName) {
        return res.status(400).send('Database name is required');
      }

      await connectionDB.createDatabase(vDBName);
      return res.json({ message: 'Database Created!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Create Database!');
  }
});

// Remove Database
app.post('/removeDatabase', async (req, res) => {
  try {
    if (mongoConnected) {
      const vDBName = req.body.vDBName;

      if (!vDBName) {
        return res.status(400).send('Database name is required');
      }

      await connectionDB.removeDatabase(vDBName);
      return res.json({ message: 'Database Removed!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Remove Database!');
  }
});

// Select Database
app.post('/selectDatabase', async (req, res) => {
  try {
    if (mongoConnected){
      const vDBName = req.body.vDBName;

      if (!vDBName) {
        return res.status(400).send('Database name is required');
      }

      await connectionDB.selectDatabase(vDBName);
      return res.json({ message: 'Database Selected!'});
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Select Database!');
  }
})

// Get List Collection
app.post('/getCollections', async (req, res) => {
  try {
    let list;
    if (mongoConnected) {
      list = await connectionDB.getListCollection();
    }
    res.json({list});
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Collections!')
  }
})

// Create Collection
app.post('/createCollection', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      await connectionDB.createACollection(vCollectionName);
      return res.json({ message: 'Collection Created!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Create Collection!');
  }
});

// Remove Collection
app.post('/removeCollection', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      await connectionDB.removeACollection(vCollectionName);
      return res.json({ message: 'Collection Removed!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Remove Collection!');
  }
});

// Select Collection
app.post('/selectCollection', async (req, res) => {
  try {
    if (mongoConnected){
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      await connectionDB.selectCollection(vCollectionName);
      return res.json({ message: 'Collection Selected!'});
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Select Collection!');
  }
})

// Get List of Documents in a Collection
app.post('/getDocuments', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;

      if (!vCollectionName) {
        return res.status(400).send('Collection name is required');
      }

      const documents = await connectionDB.getListDocument(vCollectionName);
      return res.json({ documents });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Documents!');
  }
});

// Select Document
app.post('/selectDocument', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;
      const pID = req.body.pID; // Assuming the document ID is sent in the request body

      if (!vCollectionName || !pID) {
        return res.status(400).send('Collection name and document ID are required');
      }

      const document = await connectionDB.selectDocument(pID);
      return res.json({ document });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Select Document!');
  }
});

// Remove Document
app.post('/removeDocument', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;
      const pID = req.body.pID; // Assuming the document ID is sent in the request body

      if (!vCollectionName || !pID) {
        return res.status(400).send('Collection name and document ID are required');
      }

      await connectionDB.removeDocument(pID);
      return res.json({ message: 'Document Removed!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Remove Document!');
  }
});

// Update Document
app.post('/updateDocument', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;
      const pID = req.body.pID; // Assuming the document ID is sent in the request body
      const pDoc = req.body.pDoc; // Assuming the updated document is sent in the request body

      if (!vCollectionName || !pID || !pDoc) {
        return res.status(400).send('Collection name, document ID, and updated document are required');
      }

      await connectionDB.updateDocument(pID, pDoc);
      return res.json({ message: 'Document Updated!' });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Update Document!');
  }
});

// Insert Document
app.post('/insertDocument', async (req, res) => {
  try {
    if (mongoConnected) {
      const vCollectionName = req.body.vCollectionName;
      const pDoc = req.body.pDoc; // Assuming the new document is sent in the request body

      if (!vCollectionName || !pDoc) {
        return res.status(400).send('Collection name and new document are required');
      }

      const insertedDoc = await connectionDB.insertDocument(pDoc);
      return res.json({ message: 'Document Inserted!', insertedDoc });
    }
    res.status(500).send('MongoDB not connected!');
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Insert Document!');
  }
});

  app.post('/getDocumentII', async (req, res) => {
    try {
      let list;
      if (mongoConnected) {
        list = await connectionDB.getListDocument();
      }
      res.json({list});
    } catch (e) {
      console.error(e);
      res.status(500).send('Unable to Retrieve Collections!')
    }
  });

  app.post('/selectDocumentII', async (req, res) => {
    try{
      let doc;
      if(mongoConnected) {
        doc = await connectionDB.selectDocument(req.body.ID);
        res.json(doc);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Unable to retrieve Document");
    }
  });

  app.post('/removeDocument', (req, res) => {

  });

  app.post('/updateDocument', (req, res) => {

  });

  app.post('/createDocument', (req, res) => {

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
