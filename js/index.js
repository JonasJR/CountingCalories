var sugg = [];
var amount;
var name;
var str;
var callurl;
var regex = /(\d+)/g;
$("#foodinput").on("input", function() {
  if ($("#foodinput").val().length > 2) {
    str = $("#foodinput").val();
    sugg = str.split(" ");
    for (i = 0; i < sugg.length; i++) {
      if (sugg[i].match(regex) != undefined) {
        amount = sugg[i];
      } else {
        name = sugg[i];
      }
    }
    console.log("Name: " + name + " Amount: " + amount);

    callurl = "http://matapi.se/foodstuff";
    $.ajax({
      url: callurl,
      dataType: "JSON",
      data: {
        query: name
      }
    }).done(function(data) {
      var index;
      $("#ulfood").empty();
      for (index = 0; index < 10; index++) {
        if (data[index] == undefined) {
          break;
        }
        $("#ulfood").append("<li class='list-group-item'><a class='searchitem' href='#' data-id='" + data[index].number + "'>" + data[index].name + "</a></li>");
      }
      $(".searchitem").on("click", function() {
        var foodnr = $(this).attr("data-id");
        $.ajax({
          url: callurl + "/" + foodnr,
          dataType: "JSON",
        }).done(function(data) {
          $("#food-table tbody").append("<tr><td>" + amount + "</td><td>" + data.name + "</td></tr>");
          $("#ulfood").empty();
          $("#foodinput").val("");

        }).fail(function() {
          console.log("failfish");
        });
      });
    }).fail(function() {
      console.log("failfish1");
    });
  }
});

function addItemToUl(obj) {
  $("#ulfood").append("<li class=" + '"list-group-item"' + ">" + data.Name + data.amount + "</li>")
}
