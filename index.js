require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log("App is running on http://localhost:3000"));

mongoose.connect(process.env.MONGODB_API);

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(async function (req, res) {
    try {
      const foundArticles = await Article.find();
      console.log(foundArticles);
      res.send(foundArticles);
    } catch (err) {
      console.log(error);
      res.status(500).send("An error occurred while fetching articles.");
    }
  })
  .post(async function (req, res) {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });

      newArticle.save();
      res.send(newArticle);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while posting articles.");
    }
  })
  .delete(async function (req, res) {
    try {
      await Article.deleteMany({}); // Passing an empty object as a condition to delete all articles
      res.send("Successfully deleted all articles");
    } catch (error) {
      console.error("failed to delete article");
      res.status(500).send("An error occurred while deleting articles.");
    }
  });

//   request targetting a specific article

app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const foundArticle = await Article.findOne({
        title: req.params.articleTitle,
      });
      console.log(foundArticle);
      res.send(foundArticle);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while fetching article.");
    }
  })

  .put(async function (req, res) {
    try {
      await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        {
          title: req.body.title,
          content: req.body.content,
        }
      );
      res.send("Successfully updated article");
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while updating the article.");
    }
  })

  .patch(async function (req, res) {
    try {
      await Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body }
      );
      res.send("Successfully updated article");
    } catch (error) {
      console.error(err);
      res.status(500).send("An error occurred while updating the article.");
    }
  })

  .delete(async function (req, res) {
    try {
      await Article.findOneAndDelete({
        title: req.params.articleTitle,
      });

      res.send("Article deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Unable to delete article");
    }
  });
