const express = require("express");
const logger = require("morgan");
// const mongoose = require("mongoose");
// const mongojs = require("mongojs");
// const cheerio = require("cheerio");
// const axios = require("axios");
const exphbs = require("express-handlebars");

// const db = require("./models");
const PORT = process.env.PORT || 3000;

const app = express();

require("./routes/apiroutes.js")(app)

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);

// Database configuration
// var databaseUrl = "scrapers";
// var collections = ["scraped"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);

// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });

app.get("/", function(req, res) {
    res.send();
  });

// app.get("/scrape", function (req, res) {
//     axios.get("https://www.npr.org/sections/news/").then(function (response) {
//         const $ = cheerio.load(response.data);

//         $("article").each(function (i, element) {
    
//             let data = {
//                 title: $(element).children("div.item-info-wrap").children('div.item-info').children("h2.title").text(),
//                 link: $(element).children("div.item-info-wrap").children('div.item-info').children("p.teaser").children("a").attr("href"),
//                 summary: $(element).children("div.item-info-wrap").children('div.item-info').children("p.teaser").children("a").text(),
//                 pic: $(element).children('div.item-image').children("div.imagewrap").children("a").children("img").attr("src")
//             }
//        console.log(data)
//                 db.scraped.insert(data)
                
//         })
//     });
// });

// app.get("/all", function (req, res) {
//     // Query: In our database, go to the animals collection, then "find" everything
//     db.scraped.find({}, function (err, found) {
//         // Log any errors if the server encounters one
//         if (err) {
//             console.log(err);
//         }
//         // Otherwise, send the result of this query to the browser
//         else {
//             res.json(found);
//         }
//     });
// });


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});



//look at folder 13 for ajax and appending json data
//
