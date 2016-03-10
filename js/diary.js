$(document).ready(function() {
  var calendar = JSON.parse(localStorage.getItem("calendar"));
  var badgedays = [];
  console.log(calendar);

  var eventData = createEventData(calendar);
  $("#my-calendar").zabuto_calendar({
    language: "en",
    data: eventData
  });
  addDateListeners(eventData);
});


function createEventData(calendar) {
  var returndata = [];
  calendar.forEach(function(day) {
    console.log(day);
    returndata.push({
      date: day.date,
      badge: true,
      title: day.date,
      body: getBodyData(),
      footer: "At Paisley Park",
      classname: "purple-event",
      "modal": true
    })
  });
  return returndata;
}


function getBodyData() {
  var body = '<div class="piechart" style="width: 900px; height: 500px;"></div>'
  return body;
}

function createChart(date) {
  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work', 11],
      ['Eat', 2],
      ['Commute', 2],
      ['Watch TV', 2],
      ['Sleep', 7]
    ]);

    var options = {
      title: 'My Daily Activities'
    };
    console.log(date + "till PieChart");
    console.log(('#zabuto_calendar_' + date + "_modal .piechart"));
    var chart = new google.visualization.PieChart($('#zabuto_calendar_' + date + "_modal .piechart"));

    chart.draw(data, options);
  }
}

function addDateListeners(calendar) {
  console.log("datelistner");

  calendar.forEach(function(day) {
    $("#zabuto_calendar_" + day.date).on("click", function() {
      createChart(day.date);
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
