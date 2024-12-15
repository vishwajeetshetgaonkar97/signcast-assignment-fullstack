const DatabaseService = require("../database/database.js");
const express = require("express");
const helpers = require("../helpers/auth.js");
const mongodb = require("mongodb");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

function CanvasRouter(database) {
  var router = express.Router();

  // Route for the homepage
  router.get("/", async (req, res) => {
    let data = await database.collections;
    console.log("data", data);
    let users = await database.collections.users.find().toArray();
    let canvases = await database.collections.canvases.find().toArray();
    console.log("canvases", canvases);
    res.json({ canvases });
  });

  // Route to add a new canvas
  router.post("/addCanvas", async (req, res) => {
    console.log("Received request:", req.body);
    let data = req.body;
    console.log("Parsed data:", data);
    const ref = {
      name: data.name,
      category: data.category,
      data: Array.isArray(data.data) ? data.data : [data.data], 
    };
    try {
      let canvases = await database.collections.canvases.insertOne(ref);
      res.json({ canvases });
    } catch (error) {
      console.error("Error inserting canvas:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router; // Ensure the router is returned properly
}

module.exports = CanvasRouter;
