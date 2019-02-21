const cheerio = require("cheerio");
const request = require("request");
// const db = require("../models")

const mongojs = require("mongojs");

var databaseUrl = "scrapers";
var collections = ["scraped"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});
module.exports = function(app) {


    app.get("/api/all", function(req, res) {

        db.scrapers.find({$query: {saved: false} }).sort( { date: -1 })
        .then( function(response) {
            res.json(response.length)
            // res.json(response)
        })

    });

    app.get("/api/comments/all", function(req, res) {
        db.scrapers.find({})
        .then( function(response) {
            res.json(response)
            // res.json(response)
        })
    });

    app.post("/api/scrape", function(req, res) {

        request("http://www.npr.org/sections/news/", function(error, response, html) {

            const $ = cheerio.load(html);

            console.log($("article.item").length)
     
        $("article").each(function (i, element) {
    
            let data = {
                title: $(element).children("div.item-info-wrap").children('div.item-info').children("h2.title").text(),
                link: $(element).children("div.item-info-wrap").children('div.item-info').children("p.teaser").children("a").attr("href"),
                summary: $(element).children("div.item-info-wrap").children('div.item-info').children("p.teaser").children("a").text(),
                pic: $(element).children('div.item-image').children("div.imagewrap").children("a").children("img").attr("src")
            }
                

                db.scrapers.create(data, function(error) {
                    if (error) console.log("Article already exists: " + data.title)
                    else {
                        console.log("New article: " + data.headline);
                    }

                    if (i == ($("article.item").length - 1)) {
                        res.json("scrape complete")
                    }
                })

            });

        })
    });

    // delete
    app.delete("/api/reduce", function(req, res) {

        db.scarpers.find({$query: {saved: false} }).sort( { date: -1 })
        .then( function(found) {

            console.log(found.length);
            let countLength = found.length;
            let overflow = countLength - 25;
            console.log(overflow)
            let overflowArray = [];

            for (var i = 0; i < (overflow); i ++) {
                overflowArray.push(found[25+i]._id);
                console.log(overflowArray)
            }

            db.Headline.remove({_id: {$in: overflowArray}}, function(error, result) {

                result["length"] = countLength;
                console.log(result)
                res.json(result)

            })

        });

    })

    app.put("/api/save/article/:id", function(req, res) {
        let articleId = req.params.id;

        db.Headline.findOneAndUpdate(
            {_id: articleId},
            {
                $set: {saved: true}
            }
        ).then(function(result) {
            res.json(result)
        })
    });


    app.put("/api/delete/article/:id", function(req, res) {
        let articleId = req.params.id;

        db.Headline.findOneAndUpdate(
            {_id: articleId},
            {
                $set: {saved: false}
            }
        ).then(function(result) {
            res.json(result)
        })
    });

    app.get("/api/notes/:id", function(req, res) {
        let articleId = req.params.id;

        db.Headline.findOne(
            {_id: articleId}
        )
        .populate("note")
        .then(function(result) {
            res.json(result)
        })
    });

    app.post("/api/create/notes/:id", function(req, res) {
        console.log(req.body);

        db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.json(err);
        });

    });

    // delete Headline documents manually if needed
    app.get("/api/clear", function(req, res) {

        db.Headline.remove()
        .then(function() {
            res.json("documents removed from headline collection")
        })

    });

    // delete Note
    app.delete("/api/delete/notes/:id", function(req, res) {

        db.Note.remove(
            {_id: req.params.id}
        )
        .then(function(result) {
            res.json(result)
        })

    });


}