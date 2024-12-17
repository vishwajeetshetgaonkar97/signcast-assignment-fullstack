const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("./database/database.js");
const multer = require("multer"); 
const canvasesRouter = require("./routes/canvases.js");
const deviceStatusRouter = require("./routes/deviceStatus.js");
const cors = require("cors");
const WebSocket = require("ws");

const PORT = 3001;

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
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

// file upload 
app.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("Received file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageMetadata = {
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };

    const result = await database.collections.images.insertOne(imageMetadata);

    const imageUrl = `https://signcast-assignment-fullstack-production.up.railway.app/uploads/${req.file.filename}`;

    console.log("Image uploaded successfully");

    res.json({
      message: "Image uploaded successfully",
      imageId: result.insertedId,
      filePath: req.file.path,
      imageUrl: imageUrl, 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const server = app.listen(PORT, async () => {
  await database.setup();
  console.log(`Server started on port ${PORT}`);
});

// Setup WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    wss.clients.forEach((client) => {
      console.log("client", client);
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  ws.send("Welcome to the WebSocket server!");
});

app.get('/', (req, res) => {
  res.send('Hello to signcast server!');
})

app.use("/canvases", canvasesRouter(database,wss));
app.use("/devices", deviceStatusRouter(database));


process.on("SIGTERM", () => {
  server.close(() => {
    console.log("HTTP server closed");
    database.client.close();
    wss.close(() => {
      console.log("WebSocket server closed");
    });
  });
});
