const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");


const cheerio = require("cheerio");
const axios = require("axios");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
axios.get("https://www.npr.org/sections/news/").then(function(response) {
    const $ = cheerio.load(response.data);
    
    $("article").each(function(i, element) {
        let results = [];

        let title = $(element).children("div.item-info-wrap").children('div.item-info').children("h2.title").text();
        let link = $(element).children("div.item-info-wrap").children('div.item-info').children("p.teaser").children("a").attr("href");
        let summary = $(element).children("div.item-info-wrap").children('div.item-info').children("p.teaser").children("a").text();
        let pic = $(element).children('div.item-image').children("div.imagewrap").children("a").children("img").attr("src");

        db.Article.create(results)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
            console.log(err);
        });
        results.push({
            title: title,
            link: link,
            summary: summary,
            pic: pic,
          });

    })
console.log(results);
res.send("Scrape Complete")
});
});

app.get("/articles", function(req, res){

    //finish the route so it grabs all of the articles
});

app.get("/articles/:id", function(req, res){
     // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});

app.post("/articles/:id", function(req, res) {
 // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note

});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});

