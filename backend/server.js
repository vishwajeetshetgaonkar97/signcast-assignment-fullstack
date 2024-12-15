const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // To load environment variables

const app = express();
const port = 3000;

// Middleware to parse JSON bodies (native Express method)
app.use(express.json()); // Replacing body-parser with express.json()

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vishwajeetshetgaonkar999:MMDD209@cluster.cnzoamb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error: ', err));

// Define Canvas schema
const canvasSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
}, { timestamps: true });

// Create Canvas model
const Canvas = mongoose.model('Canvas', canvasSchema);

// POST route to create a new canvas
app.post('/api/canvas', async (req, res) => {
  console.log("Request body:", req.body); // Log the request body

  const { name, category, data } = req.body;

  try {
    if (!name || !category || !data) {
      return res.status(400).json({ error: "Missing required fields: name, category, or data." });
    }

    // Create a new canvas document
    const newCanvas = new Canvas({
      name,
      category,
      data,
    });

    // Save the new canvas to the database
    await newCanvas.save();

    // Respond with the created canvas
    res.status(201).json(newCanvas);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create canvas', message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
