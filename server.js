var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

// Initialize Express
var app = express();

app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/news-scraper");
// var MONGODB_URI = process.env.MONGODB_URI || mongoose.connect("mongodb://localhost/mnews-scraper");

// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

// Configure routes
require("./controllers/controller.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

