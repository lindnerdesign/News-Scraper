let axios = require('axios'); // HTTP Request
let cheerio = require('cheerio'); // Web Scrapper
let mongoose = require('mongoose'); // MongoDB ORM
let db = require("../models"); // Require all models

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/onionpeeler");

// Exports
module.exports = (app) => {

 // Web Scrape ==========================================
app.get("/scrape", function(req, res) {
    axios.get("https://www.theonion.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
        var result = {};

        $("h1.headline").each(function(i, element) {
        
          result.title = $(this)
            .children()
            .text();
  
          result.link = $(this)
            .children()
            .attr("href");
  
          result.summary = $(this)
            .parent()
            .next()
            .children("div.excerpt")
            .children()
            .text();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      // res.send("Scraped");
      res.render("index",{Article:dbArticle});
    });
  });


   // Grab All Articles from DB ==========================================
  app.get("/", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index",{Article:dbArticle});
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Grab Specific Article with Note ==========================================
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
 // Save/Update Note ==========================================
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        console.log("Updated")
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

 // Save/Update Article ==========================================
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Article.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        console.log("Updated")
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Delete Note ==========================================
  app.get("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    db.Note.findByIdAndRemove({_id: req.params.id},
      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });

   // Delete Article ==========================================
   app.get("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    db.Article.findByIdAndRemove({_id: req.params.id},
      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });

}

