var host_url = window.location.host
var badges = ["video.png", "video.png", "video.png"];

$(function(){
    console.log("TESTING 1 2 3 ");
    displayAllBadges();
})

function displayAllBadges(){
    var src = $("#award-holder");

    for(i=0; i < badges.length; i++){
        var img = document.createElement("img");
       console.log( 'http://'+ host_url + "/static/pics/" + badges[i]);
       var img = $('<img/>', { src : 'http://'+ host_url + "/static/pics/" + badges[i] }).css({"width":"50px"}).appendTo(src);

    }
}