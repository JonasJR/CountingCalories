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

/*

{
  date: 2016-03-10,
  items: [{},{},{}],
  totalFat: 300,
  totalProtein: 150,
  totalCarb: 30
  totalKCal
}

*/

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
  body += '<label id="kcal-day-progress-label" for="kcal-day-progress"></label><div id="kcal-day-progress" class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="70"aria-valuemin="0" aria-valuemax="100" style="width:70%"><span class="sr-only"></span></div></div>';
  return body;
}

function createChart(day) {
  // #zabuto_calendar_' + day.date + "_modal .piechart"

  var chart = AmCharts.makeChart("piechart_" + day.date, {
    "type": "pie",
    "theme": "none",
    "dataProvider": [ {
      "Typ": "Fett",
      "Gram": day.totalFat
    }, {
      "Typ": "Kolhydrater",
      "Gram": day.totalCarb
    }, {
      "Typ": "Protein",
      "Gram": day.totalProtein
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
  console.log(day);
  var caloriesEatenInPercent = (day.totalKcal / 2400.0) * 100;
  console.log(JSON.parse(localStorage.getItem("calendar")));
  console.log(caloriesEatenInPercent);

  $("#kcal-day-progress").children().first().width(caloriesEatenInPercent + "%");
  $("#kcal-day-progress-label").text("Du har ätit " + day.totalKcal + "kcal av dina dagliga " + localStorage.getItem("energyNeeds"));
}

function addDateListeners(calendar) {

  calendar.forEach(function(day) {
    $("#zabuto_calendar_" + day.date).on("click", function() {
      createChart(day);
      createProgressbar(day);
    })
  });
}


function getdate() {

  /*
  Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
  };
  d = new Date();
  return d.yyyymmdd();
  */
}
