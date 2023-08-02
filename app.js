const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

const dbURI = "mongodb://127.0.0.1:27017/wikiDB";

mongoose.connect(dbURI, {
  useNewUrlParser: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  }
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {
  Article.find()
    .then((articles) => {
      res.send(articles);
    })
    .catch((err) => {
      res.send(err);
  })
})

.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save()
  .then((savedArticle) => {
  res.send(savedArticle);
})
.catch((err) => {
  res.send(err);
  });
})

.delete(function(req, res) {
  Article.deleteMany()
    .then((articles) => {
      res.send("Successfully deleted all Articles");
    })
    .catch((err) => {
      res.send(err);
  })
});


app.listen(8000, function() {
  console.log("Server started on port 8000");
});
