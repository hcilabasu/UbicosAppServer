var host_url = window.location.host
var badges = [];

$(function(){
    displayAllBadges();
})

var getBadgesFromDB = function(){

    $.ajax({
        type:'GET',
        url:'http://'+ host_url +'/getBadges/',
        async: false,
        success: function(e){
            //returns an array of badges
            console.log(e.badgeList)
            //badges = e.badgeList;
        }
    })
}


function displayAllBadges(){
    //get badges from database
    getBadgesFromDB();
    badges = ["social", "ques"];
    var src = $("#award-holder");

    for(i=0; i < badges.length; i++){
       var img = document.createElement("img");
       //console.log( 'http://'+ host_url + "/static/pics/" + badges[i]);
       var img = $('<img/>', { src : 'http://'+ host_url + "/static/pics/" + badges[i] + ".png" }).css({"width":"50px"}).appendTo(src);

    }
}