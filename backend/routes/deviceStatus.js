const express = require("express");
const mongodb = require("mongodb");

function DeiceStatusRouter(database) {
  var router = express.Router();


  router.get("/", async (req, res) => {
    let data = await database.collections;
    let devicesOp = await database.collections.devices.find().toArray();
    res.json({ devicesOp });
  });


  router.post("/addDevice", async (req, res) => {
    let data = req.body;
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
    const deviceID = req.params.deviceID;

    const updatedDevice = {
      name: data.name,
      isMonitoring: data.isMonitoring,
      pairingCode: data.pairingCode,

    };


    try {
      let deviceMongoId = new mongodb.ObjectId(deviceID);
      const updatednewDevice = await database.collections.devices.updateOne({ _id: deviceMongoId }, { $set: updatedDevice });

      res.json({ message: "Device updated successfully", updatednewDevice });
    } catch (error) {
      console.log("Error updating article: ", error);
    }

  });

  router.get("/device/:deviceID", async (req, res) => {
    const deviceID = req.params.deviceID;

    try {
   
      const deviceObjectId = new mongodb.ObjectId(deviceID);
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
