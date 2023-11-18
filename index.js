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

// Server Test
app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});