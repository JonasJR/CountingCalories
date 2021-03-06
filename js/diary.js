$(document).ready(function() {

  var calendar = JSON.parse(localStorage.getItem("calendar"));
  var badgedays = [];

  if (calendar == null) {
    showMessage("Du har inga dagar sparade i kalendern.");
    return;
  }

  var eventData = createEventData(calendar);
  $("#my-calendar").zabuto_calendar({
    language: "en",
    data: eventData
  });
  addDateListeners(calendar);
});

function createEventData(calendar) {
  var returndata = [];

  calendar.forEach(function(day) {

    returndata.push({
      date: day.date,
      badge: true,
      title: day.date,
      body: getBodyData(day),
      footer: "<button class='btn btn-primary more_info_button' id='more_info_button_" + day.date + "' onclick='loadMoreInfo(\"" + day.date + "\");'>Mer information</button>",
      classname: "purple-event",
      "modal": true
    })
  });
  return returndata;
}


function getBodyData(day) {
  var body = '<div id="chart_' + day.date + '"><div id="piechart_' + day.date + '" class="piechart"></div>';
  body += '<label id="kcal-day-progress-label_' + day.date + '" for="kcal-day-progress"></label><div id="kcal-day-progress_' + day.date + '" class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0"aria-valuemin="0" aria-valuemax="100" style="width:0%"><span class="sr-only"></span></div></div><div id="more-info-foodlist_' + day.date + '" ></div>';
  body += '<label for="foodlist">Du har ätit:</label>';
  body +=  '<ul class="list-group" id="more-info-foodlist_' + day.date + '">';

for (var i = 0; i < day.items.length ; i++) {
  body += '<li class="list-group-item">' + day.items[i].amount + ' ' + day.items[i].name + '</li>'
}

  body += '</ul></div>';
  body += '<div id="more-info_' + day.date + '" class="more_info_div" style="display:none"></div>';
  return body;
}

function createChart(day) {
  // #zabuto_calendar_' + day.date + "_modal .piechart"

  var chart = AmCharts.makeChart("piechart_" + day.date, {
    "type": "pie",
    "theme": "none",
    "dataProvider": [{
      "Typ": "Fett",
      "Gram": ((day.totalFat * 9) / day.totalKcal) * 100
    }, {
      "Typ": "Kolhydrater",
      "Gram": ((day.totalCarb * 4) / day.totalKcal) * 100
    }, {
      "Typ": "Protein",
      "Gram": ((day.totalProtein * 4) / day.totalKcal) * 100
    }],
    "valueField": "Gram",
    "titleField": "Typ",
    "balloon": {
      "fixedPosition": true
    },
    "export": {
      "enabled": true
    }
  });
}

function createProgressbar(day) {
  var energyNeeds = JSON.parse(localStorage.getItem("energyNeeds"));

  console.log(energyNeeds);

  var caloriesEatenInPercent = (day.totalKcal / energyNeeds) * 100;

  $("#kcal-day-progress_" + day.date).children().first().width(caloriesEatenInPercent + "%");
  $("#kcal-day-progress-label_" + day.date).text("Du har ätit " + day.totalKcal + "kcal av dina dagliga " + energyNeeds);
}

function addDateListeners(calendar) {

  calendar.forEach(function(day) {
    $("#zabuto_calendar_" + day.date).on("click", function() {
      createChart(day);
      createProgressbar(day);
    })
  });
}

function loadMoreInfo(date) {

  var moreInfoDiv = $("#more-info_" + date);

  if ($('#more_info_button_' + date).text() != "Mindre information") {
    $('#more_info_button_' + date).text("Mindre information");
    $("#chart_" + date).hide();
    moreInfoDiv.fadeIn(200);
  } else {
    $('#more_info_button_' + date).text("Mer information");
    moreInfoDiv.hide();
    $('#chart_' + date).fadeIn(200);
  }
  var calendar = JSON.parse(localStorage.getItem("calendar"));
  var day;

  var carb, fat, protein, vitaminB6, vitaminB12, vitaminC, vitaminD, magnesium, salt, chol, iron, fibres, calcium;
  carb = fat = protein = vitaminB6 = vitaminB12 = vitaminC = vitaminD = magnesium = salt = chol = iron = fibres = calcium = 0;

  calendar.forEach(function(d) {
    if (d.date == date) {
      day = d
    }
  });

  day.items.forEach(function(item) {
    fat += parseFloat(item.fat);
    protein += parseFloat(item.protein);
    carb += parseFloat(item.carb);
    vitaminC += parseFloat(item.vitaminC);
    vitaminB6 += parseFloat(item.vitaminB6);
    vitaminB12 += parseFloat(item.vitaminB12);
    vitaminD += parseFloat(item.vitaminD);
    magnesium += parseFloat(item.magnesium);
    calcium += parseFloat(item.calcium);
    salt += parseFloat(item.salt);
    chol += parseFloat(item.cholesterol);
    iron += parseFloat(item.iron);
    fibres += parseFloat(item.fibres);
  });

  var html = '<table class="table">';
  html += '<thead><th>Typ</th><th>Mängd</th><th>% av RDI</th></thead>'
  html += '<tr><td>Fett</td><td>' + fat.toFixed(2) + 'g</td><td>-</td></tr>';
  html += '<tr><td>Kolhydrater</td><td>' + carb.toFixed(2) + 'g</td><td>-</td></tr>';
  html += '<tr><td>Protein</td><td>' + protein.toFixed(2) + 'g</td><td>-</td></tr>';
  html += '<tr><td>Salt</td><td>' + salt.toFixed(2) + 'g</td><td>-</td></tr>';
  html += '<tr><td>Kolesterol</td><td>' + chol.toFixed(2) + 'mg</td><td>-</td></tr>';
  html += '<tr><td>VitaminB6</td><td>' + vitaminB6.toFixed(2) + 'mg</td><td>' + ((vitaminB6 / 1.4) * 100).toFixed(0) + '% (1.4mg)</td></tr>';
  html += '<tr><td>VitaminB12</td><td>' + vitaminB12.toFixed(2) + 'µg</td><td>' + ((vitaminB12 / 2.5) * 100).toFixed(0) + '% (2.5ug)</td></tr>';
  html += '<tr><td>VitaminC</td><td>' + vitaminC.toFixed(2) + 'mg</td><td>' + ((vitaminC / 80) * 100).toFixed(0) + '% (80mg)</td></tr>';
  html += '<tr><td>VitaminD</td><td>' + vitaminD.toFixed(2) + 'µg</td><td>' + ((vitaminD / 5) * 100).toFixed(0) + '% (5ug)</td></tr>';
  html += '<tr><td>Magnesium</td><td>' + magnesium.toFixed(2) + 'mg</td><td>' + ((magnesium / 375) * 100).toFixed(0) + '% (375mg)</td></tr>';
  html += '<tr><td>Järn</td><td>' + iron.toFixed(2) + 'mg</td><td>' + ((iron / 14) * 100).toFixed(0) + '% (14mg)</td></tr>';
  html += '<tr><td>Fiber</td><td>' + fibres.toFixed(2) + 'g</td><td>' + ((fibres / 30) * 100).toFixed(0) + '% (~30g)</td></tr>';
  html += '<tr><td>Calcium</td><td>' + calcium.toFixed(2) + 'mg</td><td>' + ((calcium / 800) * 100).toFixed(0) + '% (800mg)</td></tr>';
  html += '</table>';

  moreInfoDiv.empty();
  moreInfoDiv.append(html);
}
