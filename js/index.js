var callurl = "http://matapi.se/foodstuff";

$("#food-input").on("input", function() {

  var foodInput = $("#food-input");
  var searchList = $("#search-list");

  console.log("hejsan!");
  if (foodInput.val().length > 2) {

    var searchTerm = foodInput.val();

    $.ajax({
      url: callurl,
      dataType: "JSON",
      data: {
        query: searchTerm
      }
    }).done(function(data) {
      console.log(data);

      searchList.empty();
      for (var index = 0; index < 10; index++) {
        if (data[index] == undefined) {
          break;
        }
        searchList.append("<li class='list-group-item'><a class='searchitem' href='#' data-id='" + data[index].number + "'>" + data[index].name + "</a></li>");
      }
      $(".searchitem").on("click", function() {
        var foodId = $(this).attr("data-id");
        $.ajax({
          url: callurl + "/" + foodId,
          dataType: "JSON",
        }).done(function(data) {
          console.log(data);
          $("#food-table tbody").append("<tr><td></td><td>" + data.name + "</td></tr>");
          searchList.empty();
          foodInput.val("");

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
  searchList.append("<li class=" + '"list-group-item"' + ">" + data.Name + data.amount + "</li>")
}
