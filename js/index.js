var sugg;
var callurl;
$("#foodinput").on("input", function(){
  console.log("hejsan!");
  if($("#foodinput").val().length > 2){
    sugg = $("#foodinput").val();
    console.log(sugg);
    callurl = "http://matapi.se/foodstuff";
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
        if(data[index]== undefined){
          break;
        }
        $("#ulfood").append("<li class='list-group-item'><a class='searchitem' href='#' data-id='" + data[index].number + "'>" + data[index].name + "</a></li>");
      }
      $(".searchitem").on("click", function(){
        var foodnr= $(this).attr("data-id");
        $.ajax({
          url: callurl + "/" + foodnr,
          dataType : "JSON",
        }).done(function(data){
          console.log(data);
          $("#food-table tbody").append("<tr><td></td><td>" + data.name +"</td></tr>");
          $("#ulfood").empty();
          $("#foodinput").val("");

        }).fail(function(){
          console.log("failfish");
        });
      });
    }).fail(function(){
      console.log("failfish1");
    });
  }
});

function addItemToUl(obj){
  $("#ulfood").append("<li class=" + '"list-group-item"' + ">" + data.Name + data.amount +"</li>")
}
