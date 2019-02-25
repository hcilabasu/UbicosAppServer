
var users_list=['ant', 'giraffe', 'penguin', 'sheep', 'hippo', 'lion', 'dolphin', 'eagle', 'frog', 'duck', 'bee', 'bat', 'elephant', 'leopard', 'panda', 'fish', 'fox', 'alligator', 'kangaroo', 'liger', 'squirrel', 'zebra', 'bear', 'deer', 'dog', 'tiger', 'monkey', 'rabbit', 'AW', 'user1', 'user2']
$(function(){


    //loadtable();
    //loadGraph();
    detectTableClick();

    //https://stackoverflow.com/questions/21913283/how-to-catch-click-event-with-jquery-on-dynamically-created-button
    $('#tbody').on('click','.tchr-uname',function(e){

        console.clear();
        var username = $(this).attr('data-uname');

        //get image for this particular user
        var image_list = getImagePerUser(activity_id,username);
        //alert(image_list)
        tchr_showImageInGallery(image_list)
        $('#teacher-gallery-table').hide();
        $('#tchr-gallery').show();

    });

    $('#backToTchrTable').click(function(e){
        e.preventDefault();
        $('#teacher-gallery-table').show();
        $('#tchr-gallery').hide();
    });



})


var loadtable = function (activity_id){

    var $tableBody = $('#tbody'); // use a Id selector here
    var rowHTML = '';

    //clear any previous rows
    $('#tbody').empty();

    dataFromServer = getGalleryInfo(activity_id); //ajax method call
//    console.log(dataFromServer)
//    console.log(dataFromServer.length)
//    console.log(dataFromServer[0].comment_count.length)
//    console.log(dataFromServer[1].comment_count.length)


       //display first row
       rowHTML = '';
       rowHTML += '<td width=20%><a>Username</a></td>';
       $.each(dataFromServer, function(key, value){
            rowHTML += '<td width=30%><a>Image '+value.image_id+'</a></td>';
       })
       $tableBody.append('<tr>' + rowHTML + '</tr>');


       //display the next rows
       var current = 0
       $.each(users_list, function(key,value){

             rowHTML = '';
             rowHTML += '<td width=30%><a class="tchr-uname" data-uname=' + users_list[current] + '>' + users_list[current] + '</a></td>';

             $.each(dataFromServer, function(key,value){
                //console.log(value.comment_count)
                rowHTML += '<td width=30%><a data-index=' + value.image_id + '>' + value.comment_count[current] + '</a></td>';
             })
        $tableBody.append('<tr>' + rowHTML + '</tr>');
        current++;

    })

     $('#teacher-gallery-table').append($tableBody);


}

var getGalleryInfo = function(activity_id){

    var returnValue = null;
    $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getGalleryTableTD/'+activity_id,
            async: false, //wait for ajax call to finish
            success: function(e){
                returnValue = e.success;

            }
        })

    return returnValue;

}

var getImagePerUser = function(activity_id, username){

    var returnValue = null;
    $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getImagePerUser/'+activity_id+'/'+username,
            async: false, //wait for ajax call to finish,
            success: function(data){
                returnValue = data.success;
            }
        })

    return returnValue;

}
var detectTableClick = function(){

        //detect when username in the table is clicked
        //https://stackoverflow.com/questions/1359018/in-jquery-how-to-attach-events-to-dynamic-html-elements
        $('body').on('click', 'a.cc', function() {
            // get the username who link was clicked
            var username = $(this).text();

        });
}

var tchr_showImageInGallery = function(data){

    $("#tchr-gallery").empty();

    var obj = jQuery.parseJSON(data);
     console.log(obj)

     $.each(obj, function(key,value) {

           console.log(value.fields) //gives all the value
           // console.log(value.fields['image']); //image field in the model
           //console.log(groupArray[value.fields['group_id']-1]); //group id of the user who uploaded it

           // console.log(logged_in, value.fields['posted_by'][0])
           // console.log('primary id::',value.pk)
           // console.log('total number of images: ', obj.length)

           var groupID = groupArray[value.fields['group_id']-1];

           var li = $("<li/>").appendTo("#tchr-gallery"); //<ul id=gallery>


           if(logged_in == value.fields['posted_by'][0]){

                //adding image delete span on the image
               var span = $('<span/>')
                    .addClass('object_delete')
                    .appendTo(li);

               var img = $('<img/>', {
               src : 'http://'+ host_url +'/media/'+value.fields['image'] })
               .css({opacity:1.0})
               .appendTo(li);

               var span_badge = $('<span/>')
                        .addClass('badge')
                        .text(groupID)
                        .appendTo(li);

              //add delete button functionality
               var closeBtn = $('<span class="object_delete"></span>');
               closeBtn.click(function(e){
                    card_extension_close();
                    e.preventDefault();
                    //get ID of the deleted note
                    var deletedImageID = value.pk;
                    console.log('deleted image id :: ', deletedImageID);
                    $(this).parent().remove(); //remove item from html

                    enterLogIntoDatabase('delete image', 'image delete from gallery' , 'image-delete-'+deletedImageID, 111)


                  //delete note from database
                    $.ajax({
                        type:'POST',
                        url:'/gallery/del/'+deletedImageID,
                        async: false, //wait for ajax call to finish,
                        success: function(e){
                            console.log(e)
                            //TODO: add user log

                        }
                    })


                    return false;
                });

                li.append(closeBtn);

            }else{

               //just add others image to the gallery
               var img = $('<img/>', {
               src : 'http://'+ host_url +'/media/'+value.fields['image'] }).appendTo(li);

                var span_badge = $('<span/>')
                        .addClass('badge')
                        .text(groupID)
                        .appendTo(li);

            }

           // Add clickhandler to open the single image view
           img.on('click', function(event){

               enterLogIntoDatabase('gallery image view', 'gallery individual image view' , 'image-select-id-'+value.pk , 111)

               //console.log($(this).parent().siblings().length); //+1 gives me the total number of images in the gallery
               totalPhoto = $(this).parent().siblings().length+1;

               //use the following value to navigate through the gallery
               //console.log($(this).parent().index()) //gives the index of li within the ul id = gallery
               $('.section input[name="image-index"]').attr('value', $(this).parent().index())

               openImageView($('#gallery-view'), $(this));


           });

        });

        //reverse the image order
        var list = $('#gallery');
        var listItems = list.children('li');
        list.append(listItems.get().reverse());

}


//var loadGraph = function(){
//
////    var line1 = [["10.01.2011",3.9990],["11.01.2011",3.9910],["12.01.2011",4.0140],["13.01.2011",3.9940],["14.01.2011",3.9050],["17.01.2011",3.9340],["18.01.2011",3.9520],["19.01.2011",3.8980],["20.01.2011",3.8690],["21.01.2011",3.8830],["24.01.2011",3.8550],["25.01.2011",3.8480],["26.01.2011",3.8190],["27.01.2011",3.8440],["28.01.2011",3.8260],["31.01.2011",3.8060],["01.02.2011",3.7970],["02.02.2011",3.8060],["03.02.2011",3.8110],["04.02.2011",3.8640],["07.02.2011",3.8750],["08.02.2011",3.8640],["09.02.2011",3.8480],["11.02.2011",3.8570],["14.02.2011",3.8880],["15.02.2011",3.88],["16.02.2011",3.8520],["17.02.2011",3.8590],["18.02.2011",3.8690],["22.02.2011",3.8440],["23.02.2011",3.8080],["24.02.2011",3.7410],["25.02.2011",3.7460],["28.02.2011",3.7550],["01.03.2011",3.7520],["02.03.2011",3.76],["03.03.2011",3.7420],["04.03.2011",3.7430],["07.03.2011",3.7330],["08.03.2011",3.7260],["09.03.2011",3.76],["10.03.2011",3.7910],["11.03.2011",3.79]];
////    var plot1 = $.jqplot('teacher-student-plot', [line1], {
////        title: 'User Participation Bar Chart',
////        axes: { xaxis: { renderer: $.jqplot.DateAxisRenderer } },
////        series: [{ lineWidth: 4, markerOptions: { style: 'square' } }]
////    });
//
//    var line1 = [['ant', 4],['fox', 6],['penguin', 2],['bat', 5],['panda', 6]];
//
//    $('#teacher-student-plot').jqplot([line1], {
//        title:'User Participation',
//        seriesDefaults:{
//            renderer:$.jqplot.BarRenderer,
//            rendererOptions: {
//                // Set the varyBarColor option to true to use different colors for each bar.
//                // The default series colors are used.
//                varyBarColor: true
//            }
//        },
//        axes:{
//            xaxis:{
//                renderer: $.jqplot.CategoryAxisRenderer
//            }
//        }
//    });
//
//
//}




