const DatabaseService = require("../database/database.js");
const express = require("express");
const helpers = require("../helpers/auth.js");
const mongodb = require("mongodb");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

function ArticlesRouter(database) {
  var router = express.Router();

  // Route for the homepage
  router.get("/", async (req, res) => {
    console.log("Logged in user:", res.locals.user);
    let data = await database.collections
    console.log("data", data);
    let users = await database.collections.users.find().toArray();
    let canvases = await database.collections.canvases.find().toArray();
    console.log("canvases", canvases);
    res.json({ canvases });
  });

  router.get(
    "/editArticle/:articleID",
    async (req, res) => {
      let id = req.params.articleID;
      // Convert the ID from the URL into the proper ObjectId format expected by MongoDB
      let objectId = new mongodb.ObjectId(id);
      let articles = await database.collections.articles.find().toArray();
      let articlesObject = articles.find((item) => item._id.equals(objectId));
      console.log("articlesObject", articlesObject);

      res.render("articles/editArticles", { articlesObject: articlesObject });
    }
  );

  router.post("/addCanvas", async (req, res) => { console.log("Received request:", req.body); let data = req.body; console.log("Parsed data:", data); const ref = { name: data.name, category: data.category, data: data.data, }; try { let canvases = await database.collections.canvases.insertOne(ref); res.json({ canvases }); } catch (error) { console.error("Error inserting canvas:", error); res.status(500).json({ error: "Internal server error" }); } });

  router.post("/updateCanvas/:canvasID", async (req, res) => {
    let data = req.body;
    console.log("data", data);
    const canvasID = req.params.canvasID;

    const updateCanvas = {
      name: data.name,
      category: data.category,
      data: data.data,
    };


    try {
      console.log("ref", updateCanvas);
      let canvasMongoId = new mongodb.ObjectId(canvasID);
      console.log("canvasID", canvasMongoId);
      let canvases = await database.collections.canvases.updateOne({ _id: canvasMongoId }, { $set: updateCanvas });


      res.json({ canvases });


    } catch (error) {
      console.log("Error updating article: ", error);
    }

  });

  router.get(
    "/articleDelete/:articleID",
    helpers.isAuthenticated,
    async (req, res) => {
      const articleID = req.params.articleID;
      console.log("articleID", articleID);

      try {
        let articleMongoId = new mongodb.ObjectId(articleID);
        console.log("articleID", articleMongoId);

        const result = await database.collections.articles.deleteOne({
          _id: articleMongoId,
        });
        console.log("results", result);
      } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({ error: "Internal server error" });
      }
      res.redirect("/");
    }
  );

  return router;
}

module.exports = ArticlesRouter;
