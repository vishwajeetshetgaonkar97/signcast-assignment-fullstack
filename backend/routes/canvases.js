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

  router.post("/updateCanvas/:canvasID", async (req, res) => {
    let data = req.body;
    console.log("data", data);
    const canvasID = req.params.canvasID;
    console.log("canvasID", canvasID);

    const updatedCanvas = {
      name: data.name,
      category: data.category,
      data: Array.isArray(data.data) ? data.data : [data.data],
    };


    try {
      console.log("ref", updatedCanvas);
      let canvasMongoId = new mongodb.ObjectId(canvasID);
      console.log("canvasID", canvasMongoId);
      const updatednewCanvas = await database.collections.canvases.updateOne({ _id: canvasMongoId }, { $set: updatedCanvas });

      res.json({ message: "Canvas updated successfully", updatednewCanvas });
    } catch (error) {
      console.log("Error updating article: ", error);
    }

  });

  router.get("/canvas/:canvasID", async (req, res) => {
    const canvasID = req.params.canvasID;

    try {
      // Convert `canvasID` to a MongoDB ObjectId
      const canvasObjectId = new mongodb.ObjectId(canvasID);

      // Find the canvas by its `_id`
      const canvas = await database.collections.canvases.findOne({ _id: canvasObjectId });

      if (canvas) {
        res.json({ canvas });
      } else {
        res.status(404).json({ error: "Canvas not found" });
      }
    } catch (error) {
      console.error("Error fetching canvas by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  return router; 
}


module.exports = CanvasRouter;
