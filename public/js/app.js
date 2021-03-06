$(document).ready(function(){

$("#peeler").on("click", function() {
  event.preventDefault()
  $.ajax({
    method: "POST",
    url: "/articles"
  })
  .then(function(res){
    window.location.reload()
  })
});

$(document).on("click", "#notemod", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      $("#notes").append("<input type='text' class='form-control' id='titleinput' name='title'>");
      $("#notes").append("<textarea type='text' class='form-control' id='bodyinput' name='body'>");
      $("#notes").append("<button type='submit' class='btn btn-success' data-id='" + data._id + "' id='savenote'>Save</button>");
      $("#notes").append("<button type='submit' class='btn btn-danger' data-id='" + data.note._id + "' id='delnote'>Delete</button>");
        
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#noteModal").modal("hide");
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the delnote button
$(document).on("click", "#delnote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a GET request to change the note, using what's entered in the inputs
  $.ajax({
    type: "GET",
    url: "/delete/" + thisId,
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#noteModal").modal("hide");
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the delArt button
$(document).on("click", "#delArt", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a GET request to change the note, using what's entered in the inputs
  $.ajax({
    type: "GET",
    url: "/deleteArticle/" + thisId
  })
    // With that done
    .then(function(data) {
      window.location.reload()
      // Log the response
      console.log(data);
      // Empty the notes section
    });
  });
});