var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.Promise = Promise;

var databaseUri = "mongodb://localhost/onionpeeler";
if (process.env.MONGODB_URI){
  databaseUri = process.env.MONGODB_URI;
}
mongoose.connect(databaseUri, {
  useMongoClient: true
});

// Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Configure routes
require("./controllers/controller.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

