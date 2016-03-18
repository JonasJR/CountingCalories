$(document).ready(function() {

  var energyNeeds = JSON.parse(localStorage.getItem("energyNeeds"));

  if (energyNeeds == null) {
    energyModal = $("#energyModal");
    energyModal.modal({
      backdrop: 'static',
      keyboard: false
    })
    energyModal.modal('show');
  }

  var addEnergyModel = $("#add-energy-modal-button");
  addEnergyModel.on("click", function() {

    var array = $("#modal-form").serializeArray();
    var gender = array[0].value;
    var age = array[1].value;
    var activity = array[2].value;
    var energyNeed = 0;

    if (gender == 'male') {
      if (age == 'young' && activity == 'low') { energyNeed = 2500 }
      if (age == 'young' && activity == 'medium') { energyNeed = 2800 }
      if (age == 'young' && activity == 'high') { energyNeed = 3200 }
      if (age == 'middle' && activity == 'low') { energyNeed = 2300 }
      if (age == 'middle' && activity == 'medium') { energyNeed = 2600 }
      if (age == 'middle' && activity == 'high') { energyNeed = 3000 }
      if (age == 'senior' && activity == 'low') { energyNeed = 2000 }
      if (age == 'senior' && activity == 'medium') { energyNeed = 2300 }
      if (age == 'senior' && activity == 'high') { energyNeed = 2600 }
    } else {
      if (age == 'young' && activity == 'low') { energyNeed = 2000 }
      if (age == 'young' && activity == 'medium') { energyNeed = 2300 }
      if (age == 'young' && activity == 'high') { energyNeed = 2500 }
      if (age == 'middle' && activity == 'low') { energyNeed = 1800 }
      if (age == 'middle' && activity == 'medium') { energyNeed = 2100 }
      if (age == 'middle' && activity == 'high') { energyNeed = 2400 }
      if (age == 'senior' && activity == 'low') { energyNeed = 1700 }
      if (age == 'senior' && activity == 'medium') { energyNeed = 1900 }
      if (age == 'senior' && activity == 'high') { energyNeed = 2200 }
    }

    localStorage.setItem("energyNeeds", energyNeed);
  });

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
      footer: '<button class="btn btn-primary">Mer information</button>',
      classname: "purple-event",
      "modal": true
    })
  });
  return returndata;
}


function getBodyData(day) {
  var body = '<div id="piechart_' + day.date + '" class="piechart"></div>';
  body += '<label id="kcal-day-progress-label_' + day.date + '" for="kcal-day-progress"></label><div id="kcal-day-progress_' + day.date + '" class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0"aria-valuemin="0" aria-valuemax="100" style="width:0%"><span class="sr-only"></span></div></div>';
  return body;
}

function createChart(day) {
  // #zabuto_calendar_' + day.date + "_modal .piechart"

  var chart = AmCharts.makeChart("piechart_" + day.date, {
    "type": "pie",
    "theme": "none",
    "dataProvider": [ {
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
     "balloon":{
     "fixedPosition":true
    },
    "export": {
      "enabled": true
    }
  });
}

function createProgressbar (day) {
  var caloriesEatenInPercent = (day.totalKcal / 2400.0) * 100;

  $("#kcal-day-progress_" + day.date).children().first().width(caloriesEatenInPercent + "%");
  $("#kcal-day-progress-label_" + day.date).text("Du har ätit " + day.totalKcal + "kcal av dina dagliga " + localStorage.getItem("energyNeeds"));
}

function addDateListeners(calendar) {

  calendar.forEach(function(day) {
    $("#zabuto_calendar_" + day.date).on("click", function() {
      createChart(day);
      createProgressbar(day);
    })
  });
}
