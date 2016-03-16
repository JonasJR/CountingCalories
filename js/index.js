var callurl = "http://matapi.se/foodstuff";
var foodInput = $("#food-input");
var searchList = $("#search-list");
var saveBtn = $("#save-list-btn");
var clearBtn = $("#clear-list-btn");
var trashBtn = $(".trashcan");
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
    getFoodList();
  }
});

function getFoodList() {
  $("#food-table tbody").empty();
  var temp = JSON.parse(localStorage.getItem("foodList"));
  for (var i = 0; i < temp.length; i++) {
    appendFoodItem(temp[i].amount, temp[i].name, temp[i].kcal, temp[i].id);
  }
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
          var totalGram = units[unit] * weight;
          var totalKcal = totalGram * (data.nutrientValues.energyKcal / 100);
          var totalFat = totalGram * (data.nutrientValues.fat / 100);
          var totalProtein = totalGram * (data.nutrientValues.protein / 100);
          var totalCarb = totalGram * (data.nutrientValues.carbohydrates / 100);
          var totalVitC = totalGram * (data.nutrientValues.vitaminC / 100);
          var totalVitB6 = totalGram * (data.nutrientValues.vitaminB6 / 100);
          var totalVitB12 = totalGram * (data.nutrientValues.vitaminB12 / 100);
          var totalVitD = totalGram * (data.nutrientValues.vitaminD / 100);
          var id = $.now();
          appendFoodItem(amount, data.name, totalKcal.toFixed(2), id);
          var tempFoodList = {
            id: id,
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

function appendFoodItem(amount, name, kcal, id) {
  $("#food-table tbody").append("<tr><td>" + amount + "</td><td>" + name + "</td><td>" + kcal +
    "</td><td class='center'><a href='#' id='trash" + id + "' data-id='" + id + "'><i class='glyphicon glyphicon-trash'></i></a></td></tr>");
  $("#trash" + id).on("click", function() {
    console.log("click called");
    var temp = [];
    temp = JSON.parse(localStorage.getItem("foodList"));
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].id == $("#trash" + id).attr("data-id")) {
        var indexremove = temp.indexOf(temp[i]);
        if (indexremove > -1) {
          temp.splice(indexremove, 1);
        }
      }
    }
    localStorage.setItem("foodList", JSON.stringify(temp));
    getFoodList();
  });
}

saveBtn.on("click", function() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var time = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;

  if (localStorage.getItem("foodList") != undefined) {
    var fat = 0;
    var protein = 0;
    var carb = 0;
    var kcal = 0;
    var tempFood = [];
    var tempFoodList = [];
    tempFood = JSON.parse(localStorage.getItem("foodList"));
    var tempCal = [];
    if (localStorage.getItem("calendar") != undefined) {
      tempCal = JSON.parse(localStorage.getItem("calendar"));
    }
    for (var i = 0; i < tempFood.length; i++) {
      tempFoodList.push(tempFood[i]);
      fat += parseInt(tempFood[i].fat);
      protein += parseInt(tempFood[i].protein);
      carb += parseInt(tempFood[i].carb);
      kcal += parseInt(tempFood[i].kcal);
    }
    var tempFoodList = {
      date: time,
      items: tempFood,
      totalFat: fat,
      totalProtein: protein,
      totalCarb: carb,
      totalKcal: kcal
    }
    tempCal.push(tempFoodList);
    localStorage.setItem("calendar", JSON.stringify(tempCal));
    console.log(localStorage.getItem("calendar"));
  }
});

clearBtn.on("click", function() {
  $("#food-table tbody").empty();
  localStorage.removeItem("foodList");
});
