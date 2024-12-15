// ----- CODE MODIFICATION NOT REQUIRED UNTIL LINE 40 OF THIS FILE -----

// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("./database/database.js");
const mongodb = require("mongodb");
const ArticlesRouter = require("./routes/articles.js");
const AuthRouter = require("./routes/auth.js");
const CanvasRouter = require("./routes/canvases.js");

const PORT = 3000;
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// app.use('/', AuthRouter(database));
// app.use('/', ArticlesRouter(database));
app.use('/canvases', CanvasRouter(database));

app.listen(PORT, async () => {
  await database.setup();
  console.log(`Server started on port ${PORT}`);
});


process.on("SIGTERM", () => {
  app.close(() => {
    database.client.close();
  });
});
