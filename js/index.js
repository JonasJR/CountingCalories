var callurl = "http://matapi.se/foodstuff";
var foodInput = $("#food-input");
var searchList = $("#search-list");
var sugg = [];
var amount;
var regex = /(\d+)/g;
var units = {
  g: 1,
  gram: 1,
  hg: 100,
  hekto: 100,
  kg: 1000,
  kilo: 1000,
  dl: 100,
  cl: 10,
  l: 1000,
  liter: 1000,
  msk: 15,
  tsk: 5,
  krm: 1
}

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
          var unit = "";
          var weight = "";
          for (var i = 0; i < amount.length; i++) {
            if (/^[0-9]+$/.test(amount[i])) {
              weight += amount[i];
            } else {
              unit += amount[i];
            }
          }
          var totalgram = units[unit] * weight;
          var singleKcal = data.nutrientValues.energyKcal / 100;
          var totalKcal = totalgram * singleKcal;
          console.log(totalKcal);
          console.log(units[unit]);
          console.log(weight);
          console.log(unit);

          $("#food-table tbody").append("<tr><td>" + amount + "</td><td>" + data.name + "</td><td>" + totalKcal + "</td></tr>");
          searchList.empty();
          foodInput.val("");

        }).fail(function() {
          console.log("food id fail");
        });
      });
    }).fail(function() {
      console.log("fail to connect to matapi");
    });
  }
});
