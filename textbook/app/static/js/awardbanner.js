var host_url = window.location.host
var badges = [];
var dict = {'suggestion': false, 'social' : false, 'relevance' : false, 'reflection' : false, 'ques' : false, 'feedback' : false, 'explanation' : false, 'co-construction' : false};

$(function(){
    displayAllBadges();

    //hovering effect on all the badges
    for(var key in dict){

        $("img#"+key).on("mouseover", function () {
             //stuff to do on mouseover
             //alert('here') //works
             var display = $(this).attr('id');
             $('#badge-description').text(display);
             $('#badge-description').css('opacity','1');

             
        }).on("mouseout", function(){
            $('#badge-description').css('opacity','0');
        });
    }



})

var getBadgesFromDB = function(){

    $.ajax({
        type:'GET',
        url:'http://'+ host_url +'/getBadges/',
        async: false,
        success: function(e){
            //returns an array of badges
            console.log(e.badgeList)
            badges = e.badgeList;
        }
    })
}

function displayAllBadges(){
    //get badges from database

    getBadgesFromDB();
    //badges = ["social", "ques"];

    var src = $("#award-holder");

    for(var i = 0; i < badges.length; i++){
        dict[badges[i]] = true;
    }

    for(var key in dict){
        var divBnr = $('<div style="float:left"></div>');
        $(src).append(divBnr);

        var spandiv = $('<span class="imgtooltip"></span>');
        $(divBnr).append(spandiv)

        var img = document.createElement("img");

        if(dict[key])
            var img = $('<img/>', { id: key, src : 'http://'+ host_url + "/static/pics/" + key + ".png" }).css({"width":"30px", "margin-right": "5px", "margin-left": "5px"}).appendTo(divBnr);
            //img.appendTo(imgDivBnr);
        else
            var img = $('<img/>', { id: key,  src : 'http://'+ host_url + "/static/pics/" + "blank" + ".png" }).css({"width":"30px", "margin-right": "5px", "margin-left": "5px"}).appendTo(divBnr);
            //img.appendTo(imgDivBnr);
    }

   // src.append("</center>");
  }




