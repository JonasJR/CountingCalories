$ ->
  calendar = JSON.parse(localStorage.getItem("calendar"))
  eventData = createEventData(calendar)

  $("#my-calendar").zabuto_calendar(
    language: "en"
    data: eventData
  )
  addDateListeners(calendar)

###


  date: 2016-03-10,
  items: [{},{},{}],
  totalFat: 300,
  totalProtein: 150,
  totalCarb: 30
  totalKCal

###

createEventData = (calendar) ->
  returnData = []

  return if calendar == null

  calendar.forEach (day) ->
    returnData.push
      date: day.date
      badge: true
      title: day.date
      body: getBodyData(day)
      footer: '<button class="btn btn-primary">Mer information</button>'
      classname: "purple-event"
      modal: true

  return returnData

getBodyData = (day) ->
  body = "<div id=\"piechart_#{day.date}\" class=\"piechart\"></div>"
  body

createChart = (day) ->
  console.log day
  chart = AmCharts.makeChart("piechart_#{day.date}",
    type: "pie"
    theme: "none"
    dataProvider: [
      Typ: "Fett"
      Gram: day.totalFat
    ,
      Typ: "Kolhydrater"
      Gram: day.totalCarb
    ,
      Typ: "Protein"
      Gram: day.totalProtein
    ],
    valueField: "Gram"
    titleField: "Typ"
    balloon:
      fixedPosition: true
    export:
      enabled: true
  )

addDateListeners = (calendar) ->

  return if calendar == null

  calendar.forEach (day) ->
    $("#zabuto_calendar_" + day.date).on "click", ->
      createChart(day)

getdate = ->
  Date.prototype.yyyymmdd = ->
    yyyy = this.getFullYear().toString()
    mm = (this.getMonth() + 1).toString()
    dd = this.getDate().toString()
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0])

  d = new Date()
  return d.yyyymmdd()
