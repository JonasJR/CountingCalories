var food;
var callurl;
$("#addbutton").on("click", function(){
  food = $("#foodinput").val();
  console.log(food);
  showMessage(food);
  callurl = "fatsecretapiurl";
  $.ajax({
    url: callurl,
    dataType : "JSON",
    data: {
      escape: "javascript"
    }
  }).done(function(data){
    console.log("done!");
  }).fail(function(data){
    console.log("failfish");
  });
});

function addItemToUl(data){
  $("#ulfood").append("<li class=" + '"list-group-item"' + ">" + data.Name + data.amount +"</li>")
}
