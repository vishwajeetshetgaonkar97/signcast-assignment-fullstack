// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("./database/database.js");
const mongodb = require("mongodb");
const CanvasRouter = require("./routes/canvases.js");

const PORT = 3000;
const cors = require("cors");
const logger = require('morgan');

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'application/json' }));  // to handle raw JSON streams


app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/canvases', CanvasRouter(database));

app.use((req, res, next) => {
  console.log("Request body: ", req.body);
  next();
});

app.post('/example', (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  res.send('Request body received');
});

app.listen(PORT, async () => {
  await database.setup();
  console.log(`Server started on port ${PORT}`);
});

process.on("SIGTERM", () => {
  app.close(() => {
    database.client.close();
  });
});
