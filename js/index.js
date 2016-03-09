var callurl = "http://matapi.se/foodstuff";
var foodInput = $("#food-input");
var searchList = $("#search-list");
var sugg = [];
var amount;
var regex = /(\d+)/g;

foodInput.on("input", function() {
  var searchTerm = foodInput.val();
  if (foodInput.val().length > 2) {
    sugg = searchTerm.split(" ");
    for (i = 0; i < sugg.length; i++) {
      if (sugg[i].match(regex) != undefined) {
        amount = sugg[i];
      } else {
        searchTerm = sugg[i];
      }
    }

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
        if (sugg.length < 2) {
          showErrorMessage("Vänligen ange både mängd och livsmedel.");
          return;
        }
        if (amount.match(/^[0-9]+$/) != null) {
          showErrorMessage("Vilken enhet är det?");
          return;
        }
        hideMesssage();
        var foodId = $(this).attr("data-id");
        $.ajax({
          url: callurl + "/" + foodId,
          dataType: "JSON",
        }).done(function(data) {
          console.log(data);
          $("#food-table tbody").append("<tr><td>" + amount + "</td><td>" + data.name + "</td><td>" + data.nutrientValues.energyKcal + "</td></tr>");
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
