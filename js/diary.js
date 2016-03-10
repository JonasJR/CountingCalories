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


function createEventData(calendar) {
  var returndata = [];
  calendar.forEach(function(day) {
    console.log(day);
    returndata.push({
      date: day.date,
      badge: true,
      title: day.date,
      body: getBodyData(day.date),
      footer: '<button class="btn btn-primary">Mer information</button>',
      classname: "purple-event",
      "modal": true
    })
  });
  return returndata;
}


function getBodyData() {
  var body = '<div class="piechart"></div>'
  return body;
}

function createChart(day) {
  console.log(day.fat);

  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    console.log(day.fat);
    var data = google.visualization.arrayToDataTable([
      ['Intag', 'Energi procent'],
      ['Fett', day.fat],
      ['Kolhydrat', day.carb],
      ['Protein', day.protein],
    ]);

    var options = {
      title: 'My Daily Activities'
    };

    var chart = new google.visualization.PieChart($('#zabuto_calendar_' + day.date + "_modal .piechart")[0]);

    chart.draw(data, options);
  }
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
