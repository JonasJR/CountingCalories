var callurl = "http://matapi.se/foodstuff";
var foodInput = $("#food-input");
var searchList = $("#search-list");
var saveBtn = $("#save-list-btn");
var clearBtn = $("#clear-list-btn");
var trashBtn = $(".trashcan");
var calendar = [];
var tempFoodList = [];
var tempList = [];
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

Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

$(document).ready(function() {
  $('#datePicker').val(new Date().toDateInputValue());
  getFoodList();
});

$("#datePicker").on("change", function() {
  getFoodList();
});

function getFoodList() {
  calendar = [];
  tempList = [];
  $("#food-table tbody").empty();

  if (localStorage.getItem("calendar") != undefined) {
    var temp2 = JSON.parse(localStorage.getItem("calendar"));
    var tempCalFood = [];
    for (var i = 0; i < temp2.length; i++) {
      if (temp2[i].date == $('#datePicker').val()) {
        tempCalFood = temp2[i].items;
        for (var j = 0; j < tempCalFood.length; j++) {
          appendFoodItem(tempCalFood[j]);
          tempList.push(tempCalFood[j]);
        }
      } else {
        if(temp2[i].items.length < 1){

        }else {
          calendar.push(temp2[i]);
        }
      }
    }
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
          appendFoodItem(tempFoodList);
          tempList.push(tempFoodList);
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

function appendFoodItem(list) {
  $("#food-table tbody").append("<tr id='foodrow"+ list.id + "'><td>" + list.amount + "</td><td>" + list.name + "</td><td>" + list.kcal +
    "</td><td class='center'><a href='#' id='trash" + list.id + "' data-id='" + list.id + "'><i class='glyphicon glyphicon-trash'></i></a></td></tr>" +
    "<tr id='foodinfo" + list.id +"' style='font-style:italic;'><td>Protein: " + list.protein +"</td><td>Kolhydrater: " + list.carb +"</td><td>Fett: " + list.fat + "</td><td> </td></tr>");
    $("#foodinfo" + list.id).hide();
  $("#foodrow" + list.id).on("click", function(){
    $("#foodinfo" + list.id).toggle();
    console.log(this);
  });
  $("#trash" + list.id).on("click", function() {
    for (var i = 0; i < tempList.length; i++) {
      if (tempList[i].id == $("#trash" + list.id).attr("data-id")) {
        var indexremove = tempList.indexOf(tempList[i]);
        if (indexremove > -1) {
          tempList.splice(indexremove, 1);
          var time = $("#datePicker").val();
          var fat = 0;
          var protein = 0;
          var carb = 0;
          var kcal = 0;
          var tempFoodList = [];

          for (var i = 0; i < tempList.length; i++) {
            tempFoodList.push(tempList[i]);
            fat += parseInt(tempList[i].fat);
            protein += parseInt(tempList[i].protein);
            carb += parseInt(tempList[i].carb);
            kcal += parseInt(tempList[i].kcal);
          }

          var tempFoodListRemoved = {
            date: time,
            items: tempFoodList,
            totalFat: fat,
            totalProtein: protein,
            totalCarb: carb,
            totalKcal: kcal
          }
          var tempCalendar = calendar;
          tempCalendar.push(tempFoodListRemoved);
          localStorage.setItem("calendar", JSON.stringify(tempCalendar));
          tempCalendar = [];
          tempList = [];
        }
      }
    }
    getFoodList();
  });
}

saveBtn.on("click", function() {
  var time = $("#datePicker").val();
  var fat = 0;
  var protein = 0;
  var carb = 0;
  var kcal = 0;
  var tempFoodList = [];

  for (var i = 0; i < tempList.length; i++) {
    tempFoodList.push(tempList[i]);
    fat += parseInt(tempList[i].fat);
    protein += parseInt(tempList[i].protein);
    carb += parseInt(tempList[i].carb);
    kcal += parseInt(tempList[i].kcal);
  }
  var tempFoodList2 = {
    date: time,
    items: tempFoodList,
    totalFat: fat,
    totalProtein: protein,
    totalCarb: carb,
    totalKcal: kcal
  }
  var tempCalendar = calendar;
  if(tempFoodList.length < 1){
    showMessage("Dagen är borttagen");
  } else {
    tempCalendar.push(tempFoodList2);
    showMessage("Tillagd i din kalender! Kul!");
  }
  localStorage.setItem("calendar", JSON.stringify(tempCalendar));
  tempCalendar = [];
  tempList = [];
  fadeOutMessage(2000);
});

clearBtn.on("click", function() {
  $("#food-table tbody").empty();
  tempList = [];
});
