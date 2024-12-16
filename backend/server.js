// ----- CODE MODIFICATION NOT REQUIRED UNTIL LINE 40 OF THIS FILE -----

// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("./database/database.js");
const mongodb = require("mongodb");
const ArticlesRouter = require("./routes/articles.js");
const AuthRouter = require("./routes/auth.js");
const canvasesRouter = require("./routes/canvases.js");
const deviceStatusRouter = require("./routes/deviceStatus.js");
const cors = require("cors");
const WebSocket = require("ws");
const PORT = 3000;

// Initialize Express app
const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's URL
}));

app.use(bodyParser());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

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
