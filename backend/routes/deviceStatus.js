const DatabaseService = require("../database/database.js");
const express = require("express");
const helpers = require("../helpers/auth.js");
const mongodb = require("mongodb");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

function DeiceStatusRouter(database) {
  var router = express.Router();

  // Route for the homepage
  router.get("/", async (req, res) => {
    let data = await database.collections;
    let devicesOp = await database.collections.devices.find().toArray();
    console.log("devices", devicesOp);
    res.json({ devicesOp });
  });

  // Route to add a new canvas
  router.post("/addDevice", async (req, res) => {
    console.log("Received request:", req.body);
    let data = req.body;
    console.log("Parsed data:", data);
    const ref = {
      name: data.name,
      isMonitoring: data.isMonitoring,
      pairingCode: data.pairingCode,
    };
    try {
      let devicesop = await database.collections.devices.insertOne(ref);
      res.json({ devicesop });
    } catch (error) {
      console.error("Error inserting devices:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/updateDevice/:deviceID", async (req, res) => {
    let data = req.body;
    console.log("data", data);
    const deviceID = req.params.deviceID;
    console.log("deviceID", deviceID);

    const updatedDevice = {
      name: data.name,
      isMonitoring: data.isMonitoring,
      pairingCode: data.pairingCode,

    };


    try {
      console.log("ref", updatedDevice);
      let deviceMongoId = new mongodb.ObjectId(deviceID);
      console.log("deviceID", deviceMongoId);
      const updatednewDevice = await database.collections.devices.updateOne({ _id: deviceMongoId }, { $set: updatedDevice });

      res.json({ message: "Device updated successfully", updatednewDevice });
    } catch (error) {
      console.log("Error updating article: ", error);
    }

  });

  router.get("/device/:deviceID", async (req, res) => {
    const deviceID = req.params.deviceID;

    try {
      // Convert `canvasID` to a MongoDB ObjectId
      const deviceObjectId = new mongodb.ObjectId(deviceID);

      // Find the canvas by its `_id`
      const deviceop = await database.collections.devices.findOne({ _id: deviceObjectId });

      if (deviceop) {
        res.json({ deviceop });
      } else {
        res.status(404).json({ error: "device not found" });
      }
    } catch (error) {
      console.error("Error fetching device by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  return router; 
}


module.exports = DeiceStatusRouter;
