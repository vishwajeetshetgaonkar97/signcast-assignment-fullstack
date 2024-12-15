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
    let users = await database.collections.users.find().toArray();
    let articles = await database.collections.articles.find().toArray();
    console.log("articles", articles);
  
    let userId = res.locals.user && res.locals.user._id  ? res.locals.user._id : "";
    console.log("user", userId);
    // res.render("index", { articles: articles,isLoggedIn:!!res.locals.user , loggedInUserId:userId});
    res.json({ articles });

  });

  router.get(
    "/editArticle/:articleID",
    async (req, res) => {
      let id = req.params.articleID;
      // Convert the ID from the URL into the proper ObjectId format expected by MongoDB
      let objectId = new mongodb.ObjectId(id);
      let articles = await database.collections.articles.find().toArray();
      let articlesObject = articles.find((item) => item._id.equals(objectId));  
      console.log("articlesObject",articlesObject);

      res.render("articles/editArticles", { articlesObject: articlesObject });
    }
  );

  router.get("/add-Articles", helpers.isAuthenticated, async (req, res) => {
    res.render("articles/addArticles");
  });

  router.post("/addArticle", upload.single("imageUpload"), async (req, res) => {
    let data = req.body;
    console.log("data", data);
    console.log("data", data);
    let imageUpload = req.file ? req.file.path : "";
    console.log("imageUpload", imageUpload);

    const ref = {
      headline: data.headline,
      subhead: data.subhead,
      content: data.content,
      imageUpload: imageUpload,
      author: res.locals.user._id,
      authorFirstName: res.locals.user.firstName,
      authorLastName: res.locals.user.lastName,
      authorProfileImage: res.locals.user.profileImage,
    };
    console.log("Logged in user:", res.locals.user);
    console.log("ref", ref);
    await database.collections.articles.insertOne(ref);

    res.redirect("/");
  });

  router.post("/updateArticle/:articleID", upload.single("imageUpload"), async (req, res) => {
    let data = req.body;
    console.log("data", data);
    const articleID = req.params.articleID;

    let imageUpload = req.file ? req.file.path : data.defaultImage;
    console.log("imageUpload", imageUpload);

    const updateArticle = {
      headline: data.headline,
      subhead: data.subhead,
      content: data.content,
      imageUpload: imageUpload,
    };


    try {
      console.log("ref", updateArticle);
      let articleMongoId = new mongodb.ObjectId(articleID);
      console.log("articleID", articleMongoId);
       await database.collections.articles.updateOne(        { _id: articleMongoId },  { $set: updateArticle });

    res.redirect("/");
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
