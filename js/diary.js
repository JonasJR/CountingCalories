$(document).ready(function() {
  var calendar = JSON.parse(localStorage.getItem("calendar"));
  var badgedays = [];
  console.log(calendar);

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
  var body = '<div id="piechart_' + day.date + '" class="piechart"></div>'
  return body;
}

function createChart(day) {
  // #zabuto_calendar_' + day.date + "_modal .piechart"

  var chart = AmCharts.makeChart("piechart_" + day.date, {
    "type": "pie",
    "theme": "none",
    "dataProvider": [ {
      "Typ": "Fett",
      "Gram": day.fat
    }, {
      "Typ": "Kolhydrater",
      "Gram": day.carb
    }, {
      "Typ": "Protein",
      "Gram": day.protein
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

function addDateListeners(calendar) {
  console.log("datelistner");

  calendar.forEach(function(day) {
    $("#zabuto_calendar_" + day.date).on("click", function() {
      createChart(day);
    })
  });
}


function getdate() {
  Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
  };
  d = new Date();
  return d.yyyymmdd();
}
