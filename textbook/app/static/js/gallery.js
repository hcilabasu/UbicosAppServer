
var host_url = window.location.host
var logged_in = ''
var totalPhoto

$(function(){

    getLoggedUserName();

    //channel for individual image message
     var pusher_gallery = new Pusher('f6bea936b66e4ad47f97',{
        cluster: 'us2',
        encrypted: true
     });

    //subscribe to the channel you want to listen to
    var my_channel = pusher_gallery.subscribe('b_channel');

    my_channel.bind("bn_event", function (data) {

        //message entered by the user
        //console.log(data);


        console.log('(server)', data.imageid)
        console.log('(local)', $("input[name='image-db-pk']").val())

        //if student commenting on one image is the same as the other user is viewing show the comment else don't show
        if(data.imageid == $("input[name='image-db-pk']").val())
        {
            //  add in the individual image discussion thread itself
            var li = $("<li/>").appendTo("#image-feed");

            //console.log ('message posted by', data.name);
            //console.log('logged in username (outside):: ', logged_in);

            if(logged_in == data.name){
                   li.addClass('message self');
            }else{
                   li.addClass('message');
            }

            var div = $("<div/>").appendTo(li);
            div.addClass('user-image');

            var span = $('<span/>', {
                text: data.name}).appendTo(div);

            var p = $('<p/>', {
                    text: data.message}).appendTo(li);
        }



    });

     //add event listener to the chat button click
    $("#image-msg-send-btn").click(function(e){

        //stop page refreshing with click
            e.preventDefault();

        //get the user name who posted
            var user_name = $("input[name='username']").val()
            console.log(user_name);

        //get the currently typed message
            var message = $("input[name='image-msg-text']").val();
            console.log('user message :: '+message)

        //get the gallery id of the image
            var gallery_id = $("input[name='act-id']").val();
            console.log('image gallery id :: ', gallery_id)

            var imagePk = $("input[name='image-db-pk']").val();
            console.log('image pk :: ',imagePk)


            if(message == ""){
                console.log('empty input gallery')
                enterLogIntoDatabase('input button click', 'image-feed empty message input' , message, current_pagenumber)
            }
            else{
                  enterLogIntoDatabase('input button click', 'image-feed message input' , message, current_pagenumber)
                 //posts student comment in database - can be extracted using image primary key.
                $.post({
                    url: '/ajax/imageComment/',
                    data: {
                    'username': user_name,
                    'message':  message,
                    'imagePk': imagePk
                    },
                    success: function (data) {

                        //empty the message pane
                        $("input[name='image-msg-text']").val('');

                        //console.log(data)

                    }
                });

            }


        })


        $("#file-upload").change(function(event){

                enterLogIntoDatabase('click', 'image upload attempted' , '', current_pagenumber)

                console.log("file changed");

                //get file information
                var form_data = new FormData($('#upload-img')[0]);
                //console.log('form_data', form_data)

                var img_data //variable to store the image

                //ajax call to post the uploaded image in the database and with successful entry show the image at the beginning of the list
                $.ajax({
                      type:'POST',
                      url:'http://'+ host_url +'/uploadImage/',
                      processData: false,
                      contentType: false,
                      async: false,
                      cache: false,
                      data : form_data,
                      success: function(response){

                        //clear default image
                        $('#default').attr('src', "{% static 'pics/default.png' %}");

                        //TODO: update user with a 'success' message on the screen

                        //update gallery with newly uploaded image
                        img_data = response.success;
                        var obj = jQuery.parseJSON(img_data);


                        var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

                         //adding image delete span
                         var span = $('<span/>')
                            .addClass('object_delete')
                            .appendTo(li);

                        var img = $('<img/>', {
                                src : 'http://'+ host_url + obj.url }).css({opacity:1.0}).appendTo(li);


                         img.on('click', function(event){
                           enterLogIntoDatabase('image click', 'gallery' , obj.url , 111)
                           totalPhoto = $(this).parent().siblings().length+1;
                           $('.section input[name="image-index"]').attr('value', $(this).parent().index())
                           openImageView($('#gallery-view'), $(this));

                       });

                        //reverse the image order
                        var list = $('#gallery');
                        var listItems = list.children('li');
                        list.append(listItems.get().reverse());

                    }

                  });

            });

            //update preview image
            $("#file-upload").change(function(){
                readURL(this);
            });

            //previous image button
            $(".previous-image").click(function(e){
                e.preventDefault();

                var val = $('input[name=image-index]').val() - 1
                if(val<0)  return !$(this).attr('disabled'); //disable when reached to last image
                $('.section input[name="image-index"]').attr('value', val)
                //console.log('previous image index:: ', val)
                var prev_img = $('#gallery li').eq(val).children('img')[0]
                //console.log($(prev_img))
                openImageView($('#gallery-panel'), $(prev_img));

                enterLogIntoDatabase('image navigation click', 'previous image view click' , 'total photo '+totalPhoto, current_pagenumber)

            })

            //next image button
            $(".next-image").click(function(e){
                e.preventDefault();

                var val = eval($('input[name=image-index]').val()) + 1
                enterLogIntoDatabase('image navigation click', 'next image view click' , 'total photo'+totalPhoto, current_pagenumber)
                //console.log('total photo :: ', totalPhoto);
                 if(val>=totalPhoto)  return !$(this).attr('disabled'); //disable when reached to last image
                $('.section input[name="image-index"]').attr('value', val)
                //console.log('previous image index:: ', val)
                var prev_img = $('#gallery li').eq(val).children('img')[0]
                //console.log($(prev_img))
                openImageView($('#gallery-panel'), $(prev_img));

                enterLogIntoDatabase('image navigation click', 'next image view click' , 'total photo '+totalPhoto, current_pagenumber)

            })

            //back to gallery from single image view
            $("#backToGallery").click(function(e){
                e.preventDefault();
                enterLogIntoDatabase('back to gallery button click', 'next image view click' , 'total photo '+totalPhoto, current_pagenumber)
                $("#single-image-view").hide()
                $("#gallery-panel").show()
            })


 })

 //function called from digTextBook.js
function viewDiv(view, number_of_group){

    if(view == "class"){
        //$('#gallery-user-submission').show();
        console.log("which group?? ", number_of_group)
        displayGallery(number_of_group);


    }else if(view == "comment"){
        //$('#gallery-user-submission').hide();

        console.log($('input[name="act-id"]').val())
        var group_id_user
        //get the group id of the user
        $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getGroupID/'+$('input[name="act-id"]').val(),
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                group_id_user = e;
            }
        })

        displayGallery(group_id_user);


    }

}

function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
                reader.onload = function (e) {
                    $('#default').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
        }
         $('#default').attr('src', "{% static 'pics/default.png' %}");
}


//    function viewDiv(view, number_of_group){
//
//        //console.log('value pass to gallery.js', view)
//        if(view == 'class'){
//
//            $('#gallery-user-submission').show();
//
//            //$('#upload-img input[name="group-id"]').attr('value', 0)
//            $('.card.gallery #gallery-group-heading').text('All Submission'); //update the sub-title of gallery page
//
//            displayGallery(0)
//            displayGallery($("input[name='group-id']").val())
//
//        }else if(view == 'comment'){
//                $('#gallery-user-submission').hide();
//
//                $('#upload-img input[name="group-id"]').attr('value', 0)
//                $('.card.gallery #gallery-group-heading').text('All Submission'); //update the sub-title of gallery page
//
//                 displayGallery(0)
//            }
//            else{
//
//            //TODO: check if 'group' was selected before
//
//            console.log('total number of group (gallery.js): ', number_of_group)
//
//            $('.card.active').removeClass('active');
//            $('.card.group').addClass('active');
//
//            //clear previous items
//            $('#group-view').empty();
//
//            //add radio button dynamically
//            for (i = 1; i <= number_of_group; i++) {
//                $('<input type="radio" name="radiogroup" value="'+i+'"/> Group '+ i +'</br>').appendTo('#group-view');
//             }
//
//            //get group id from the radio button
//            var groupValue
//            $("input[name='radiogroup']").change(function(){
//                groupValue = $("input[name='radiogroup']:checked").val();
//                if(groupValue){
//                        //pass group value in the form so it can be added into the database
//                        $('#upload-img input[name="group-id"]').attr('value', groupValue)
//
//                        console.log('group ID :: ', groupValue) //debug
//                        $('.card.group').removeClass('active');
//                        $('.card.gallery').addClass('active');
//
//                        //update the sub-title of gallery page
//                        $('.card.gallery #gallery-group-heading').text('Group #'+groupValue+' Submission');
//
//                }
//
//                displayGallery(groupValue)
//            })
//        }
//    }

var openImageView = function(galleryView, image){

    var singleImageViewer = $('#single-image-view');

    // Toggle views: Display or hide the matched elements.
    $('.gallery-panel', galleryView).toggle();

    // Get image element and add it to the DOM
    var image = image.clone();

    //remove previous single image before adding new one
    $('.section').children('img').remove();

    $('.section', singleImageViewer).append(image);

    //get image location from image object
    var image_location = image.attr('src').toString();

    //get image file name
    image_filename = image_location.split('/').pop()
    console.log(image_filename)

    //get ID using filename
    var imageID='';
    $.ajax({
        type:'GET',
        async: false,
        url:'/getImageID/'+image_filename+'/',
        success: function(data){
            imageID = data.imageID;
            console.log('image primary id :: ',data.imageID);
        }
    })

    //with each click update the input
    $('.section input[name="image-db-pk"]').attr('value', imageID)
   //update feed
   //clear update feed with new image
   $('#image-feed').empty();
   //update feed with each image
     $.ajax({
             type: 'GET',
             url: '/updateImageFeed/'+imageID, //get image comment using primary id
             success: function(response){
                      console.log(response)


                    var logged_in_user = response.username //passed from views.py - updateFeed

                    msg_data = response.success
                    var obj = jQuery.parseJSON(msg_data);

                    //console.log(obj)

                    $.each(obj, function(key, value){

                        //  add in the thread itself
                        var li = $("<li/>").appendTo("#image-feed");
                        if(value.fields['posted_by'][0] == logged_in_user){
                            li.addClass('message self');
                        }else{
                            li.addClass('message');
                        }

                        var div = $("<div/>").appendTo(li);
                        div.addClass('user-image');

                        var span = $('<span/>', {
                            text: value.fields['posted_by'][0]}).appendTo(div);

                        var p = $('<p/>', {
                                text: value.fields['content']}).appendTo(li);
                        });

                        // Scroll panel to bottom
                        var imageFeedParent = $('#image-feed').closest('.row');
                        imageFeedParent.scrollTop(imageFeedParent[0].scrollHeight);
             }
     });

    //debug
    //console.log('openImageView (passed to ) :: ',$('input[name="image-db-pk"]').val())



};

function displayGallery(groupValue){

        //get the gallery ID - passed from digTextBook.js to input field
        //console.log('gallery-id, ', $("input[name='act-id").val());
        var gallery_id = $("input[name='act-id").val();
        console.log("displaying gallery #gallery id", gallery_id, groupValue)


        //get images from database for a specific gallery for specific group - 0 means whole class
        $.ajax({

           type:'GET',
           url:'http://'+ host_url +'/getImage/'+gallery_id+'/'+groupValue, //get all the image for the particular group
           success: function(response){

           //TODO: update user with a 'success' message on the screen

           img_data = response.success;
           var obj = jQuery.parseJSON(img_data);

           //console.log(img_data)

           //remove previous added items and start afresh
           $('#gallery').empty();

           $.each(obj, function(key,value) {

               // console.log(value.fields) //gives all the value
               // console.log(value.fields['image']); //image field in the model

               // console.log(logged_in, value.fields['posted_by'][0])
               // console.log('primary id::',value.pk)
               // console.log('total number of images: ', obj.length)

               var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

               if(logged_in == value.fields['posted_by'][0]){

                    //adding image delete span on the image
                   var span = $('<span/>')
                        .addClass('object_delete')
                        .appendTo(li);



                   var img = $('<img/>', {
                   src : 'http://'+ host_url +'/media/'+value.fields['image'] })
                   .css({opacity:1.0})
                   .appendTo(li);

                  //add delete button functionality
                   var closeBtn = $('<span class="object_delete"></span>');
                   closeBtn.click(function(e){

                        e.preventDefault();
                        //get ID of the deleted note
                        var deletedImageID = value.pk;
                        console.log('deleted image id :: ', deletedImageID);
                        $(this).parent().remove(); //remove item from html

                        enterLogIntoDatabase('click', 'gallery' , 'image-delete-'+deletedImageID, 111)


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

                }

               // Add clickhandler to open the single image view
               img.on('click', function(event){

                   enterLogIntoDatabase('image click', 'gallery' , 'image click id TODO' , 111)

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

    });

}


function getLoggedUserName(){

//get the logged in user
        $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getUsername/',
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                logged_in  = e.name
                //console.log('logged in username (inside) :: ', logged_in)
            }
        })

}

