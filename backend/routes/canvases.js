const DatabaseService = require("../database/database.js");
const express = require("express");
const helpers = require("../helpers/auth.js");
const mongodb = require("mongodb");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const path = require("path");

function CanvasRouter(database,wss) {
  var router = express.Router();

  const notifyClients = async () => {
    console.log("Notifying clients...");
    const canvases = await database.collections.canvases.find().toArray();
    console.log("canvases", canvases);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action: "updateAllCanvas", canvases }));
      }
    });
  };

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

       // Notify WebSocket clients
       await notifyClients();

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

  router.post("/uploadImage", upload.single("image"), async (req, res) => {
    try {
      console.log("Received request:", req.body);
      console.log("Received file:", req.file);
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      // Save file information in the database
      const imageMetadata = {
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        uploadedAt: new Date(),
      };
  
      const result = await database.collections.images.insertOne(imageMetadata);
  
      res.json({
        message: "Image uploaded successfully",
        imageId: result.insertedId,
        filePath: req.file.path,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/images/:filename", (req, res) => {
    const filename = req.params.filename;
    console.log("filename", filename);
    const filepath = path.join(__dirname, "../uploads", filename);
  
    // Check if the file exists
    fs.access(filepath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "Image not found" });
      }
  
      // Serve the image
      res.sendFile(filepath);
    });
  });

  return router; 
}


module.exports = CanvasRouter;
