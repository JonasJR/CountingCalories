messageP = ""
messageDiv = ""

$ ->
  $("#message a").on "click", ->
    $("#message").fadeOut(500)
  messageDiv = $("#message")
  messageP = $("#message p")

@showErrorMessage = (message) ->
  messageP.text message

  messageDiv.removeClass()
  messageDiv.addClass "alert alert-danger"
  messageDiv.fadeIn 400

@showMessage = (message) ->
  messageP.text message

  messageDiv.removeClass()
  messageDiv.addClass "alert alert-success"
  messageDiv.fadeIn 400

@hideMessage = ->
  messageDiv.fadeOut 400
