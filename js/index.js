var sugg;
var callurl;
$("#foodinput").on("input", function(){
  console.log("hejsan!");
  if($("#foodinput").val().length > 2){
  sugg = $("#foodinput").val();
  console.log(sugg);
  callurl = "http://matapi.se/foodstuff?";
  $.ajax({
    url: callurl,
    dataType : "JSON",
    data: {
    query: sugg
    }
  }).done(function(data){
    console.log(data);
    var index;
    $("#ulfood").empty();
    for(index = 0; index < 10 ; index ++){
      $("#ulfood").append("<li class=" + '"list-group-item"' + "><a href=" + '"www.youtube.com"' + ">" + data[index].name + "</a></li>");

    }
  }).fail(function(data){
    console.log("failfish");
  });
  }
});

function addItemToUl(obj){
  $("#ulfood").append("<li class=" + '"list-group-item"' + ">" + data.Name + data.amount +"</li>")
}
