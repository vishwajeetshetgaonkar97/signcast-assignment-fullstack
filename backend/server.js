// ----- CODE MODIFICATION NOT REQUIRED UNTIL LINE 40 OF THIS FILE -----

// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("./database/database.js");
const multer = require("multer"); 
const mongodb = require("mongodb");
const ArticlesRouter = require("./routes/articles.js");
const AuthRouter = require("./routes/auth.js");
const canvasesRouter = require("./routes/canvases.js");
const deviceStatusRouter = require("./routes/deviceStatus.js");
const cors = require("cors");
const WebSocket = require("ws");
const PORT = 3001;

// Initialize Express app
const app = express();
app.use(cors({
  origin: "*",
}));

app.use(bodyParser());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));



// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename based on current timestamp
  },
});

const upload = multer({ storage: storage });

// Route to handle image uploads
app.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("Received file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save file information in the database (optional)
    const imageMetadata = {
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };

    const result = await database.collections.images.insertOne(imageMetadata);

    // Construct the URL to access the image
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    console.log("Image uploaded successfully");

    res.json({
      message: "Image uploaded successfully",
      imageId: result.insertedId,
      filePath: req.file.path,
      imageUrl: imageUrl, // Return the public URL
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Setup routes
// app.use('/', AuthRouter(database));
// app.use('/', ArticlesRouter(database));


// Create HTTP server
const server = app.listen(PORT, async () => {
  await database.setup();
  console.log(`Server started on port ${PORT}`);
});

// Setup WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  // Handle incoming messages from the client
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      console.log("client", client);
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle WebSocket connection closure
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  // Send an initial message to the client
  ws.send("Welcome to the WebSocket server!");
});

app.get('/', (req, res) => {
  res.send('Hello to signcast server!');
})

app.use("/canvases", canvasesRouter(database,wss));
app.use("/devices", deviceStatusRouter(database));

// Graceful shutdown handling
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("HTTP server closed");
    database.client.close();
    wss.close(() => {
      console.log("WebSocket server closed");
    });
  });
});
