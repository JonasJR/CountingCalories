$(document).ready(function() {
  $("#message a").on("click", function() {
    $("#message").fadeOut(500);
  });

});

function showErrorMessage(message) {
  var messageDiv = $("#message");
  $("#message p").text(message);

  messageDiv.removeClass();
  messageDiv.addClass("alert alert-danger");
  messageDiv.fadeIn(400);
}

function showMessage(message) {
  var messageDiv = $("#message");
  $("#message p").text(message);

  messageDiv.removeClass();
  messageDiv.addClass("alert alert-success");
  messageDiv.fadeIn(400);
}

function hideMesssage(){
  var messageDiv = $("#message");
  messageDiv.fadeOut(400);
}
