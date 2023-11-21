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

// Unselect Database
app.post('/unselectDatabases', async (req, res) => {
  try {
    if (mongoConnected) {
      await connectionDB.unselectDatabase();
    }
    res.json({message: 'Unselected!'});
  } catch (e) {
    console.error(e);
    res.status(500).send('Unable to Retrieve Databases!')
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
    res.status(500).send('Unable to Remove Database!');
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

// Server Test
app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});