var callurl = "http://matapi.se/foodstuff";
var foodInput = $("#food-input");
var searchList = $("#search-list");
var saveBtn = $("#save-list-btn");
var clearBtn = $("#clear-list-btn");
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

$(document).ready(function() {
  if (localStorage.getItem("foodList") != undefined) {
    var temp = JSON.parse(localStorage.getItem("foodList"));
    for (var i = 0; i < temp.length; i++) {
      appendFoodItem(temp[i].amount, temp[i].name, temp[i].kcal);
    }
  }
});

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
          var totalGram = units[unit] * weight;
          var totalKcal = totalGram * (data.nutrientValues.energyKcal / 100);
          var totalFat = totalGram * (data.nutrientValues.fat / 100);
          var totalProtein = totalGram * (data.nutrientValues.protein / 100);
          var totalCarb = totalGram * (data.nutrientValues.carbohydrates / 100);
          var totalVitC = totalGram * (data.nutrientValues.vitaminC / 100);
          var totalVitB6 = totalGram * (data.nutrientValues.vitaminB6 / 100);
          var totalVitB12 = totalGram * (data.nutrientValues.vitaminB12 / 100);
          var totalVitD = totalGram * (data.nutrientValues.vitaminD / 100);
          var d = new Date();
          var month = d.getMonth() + 1;
          var day = d.getDate();
          var time = d.getFullYear() + '-' +
            (month < 10 ? '0' : '') + month + '-' +
            (day < 10 ? '0' : '') + day;
          appendFoodItem(amount, data.name, totalKcal.toFixed(2));
          var tempFoodList = {
            date: time,
            name: data.name,
            amount: amount,
            fat: totalFat.toFixed(2),
            kcal: totalKcal.toFixed(2),
            protein: totalProtein.toFixed(2),
            carb: totalCarb.toFixed(2),
            vitaminC: totalVitC.toFixed(2),
            vitaminB6: totalVitB6.toFixed(2),
            vitaminB12: totalVitB12.toFixed(2),
            vitaminD: totalVitD.toFixed(2)
          }
          var tempLocal = [];
          if (localStorage.getItem("foodList") != undefined) {
            tempLocal = localStorage.getItem("foodList");
            var temp = JSON.parse(tempLocal);
            tempLocal = temp;
          }
          tempLocal.push(tempFoodList);
          localStorage.setItem("foodList", JSON.stringify(tempLocal));
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

function appendFoodItem(amount, name, kcal) {
  $("#food-table tbody").append("<tr><td>" + amount + "</td><td>" + name + "</td><td>" + kcal + "</td><td><i class='glyphicon glyphicon-trash'></i></td></tr>");
}

saveBtn.on("click", function() {
  if (localStorage.getItem("foodList") != undefined) {
    var tempFood = [];
    tempFood = JSON.parse(localStorage.getItem("foodList"));
    var tempCal = [];
    if (localStorage.getItem("Calendar") != undefined) {
      tempCal = JSON.parse(localStorage.getItem("Calendar"));
    }
    for (var i = 0; i < tempFood.length; i++) {
      tempCal.push(tempFood[i]);
      console.log(tempFood[i]);
    }
    localStorage.setItem("Calendar", JSON.stringify(tempCal));
    console.log(localStorage.getItem("Calendar"));
  }
});

clearBtn.on("click", function() {
  $("#food-table tbody").empty();
  localStorage.removeItem("foodList");
});
