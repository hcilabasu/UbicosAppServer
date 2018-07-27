
var host_url = window.location.host
var logged_in = ''

$(function(){

     var pusher_gallery = new Pusher('f6bea936b66e4ad47f97',{
        cluster: 'us2',
        encrypted: true
     });

    //subscribe to the channel you want to listen to
    var my_channel = pusher_gallery.subscribe('b_channel');

    my_channel.bind("bn_event", function (data) {

        console.log(data);

        //get the logged in user
        $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getUsername/',
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                logged_in  = e.name
                console.log('logged in username (inside) :: ', logged_in)
            }
        })

        //  add in the thread itself
        var li = $("<li/>").appendTo("#image-feed");

        console.log ('message posted by', data.name)
        console.log('logged in username (outside):: ', logged_in)
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

            var index = $("input[name='image-index']").val();
            console.log('image index :: ', index)

            var imagePk = $("input[name='image-db-pk']").val();
            console.log('image pk :: ',imagePk)


           //triggers the event in views.py
            $.post({
                url: '/ajax/imageComment/',
                data: {
                'username': user_name,
                'message':  message,
                'imagePk': imagePk
                },
                success: function (data) {

                    //empty the message pane
                    $('#image-msg-text').val('');

                    //console.log(data)

                }
            });

        })


        $("#file-upload").change(function(event){

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

                        //TODO: update user with a 'success' message on the screen

                        img_data = response.success;
                        var obj = jQuery.parseJSON(img_data);


                        var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

                        var img = $('<img/>', {
                                src : 'http://'+ host_url + obj.url }).css({opacity:1.0}).appendTo(li);


                         img.on('click', function(event){
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
                $('.section input[name="image-index"]').attr('value', val)
                console.log('previous image index:: ', val)
                var prev_img = $('#gallery li').eq(val).children('img')[0]
                console.log($(prev_img))
                openImageView($('#gallery-panel'), $(prev_img));

            })

            //next image button
            $(".next-image").click(function(e){
                e.preventDefault();
                var val = eval($('input[name=image-index]').val()) + 1
                $('.section input[name="image-index"]').attr('value', val)
                console.log('previous image index:: ', val)
                var prev_img = $('#gallery li').eq(val).children('img')[0]
                console.log($(prev_img))
                openImageView($('#gallery-panel'), $(prev_img));

            })

            //back to gallery from single image view
            $("#backToGallery").click(function(e){
                e.preventDefault();
                $("#single-image-view").hide()
                $("#gallery-panel").show()
            })


 })

function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
                reader.onload = function (e) {
                    $('#default').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
        }
}

//function called from digTextBook.js
function viewDiv(view, number_of_group){

    //console.log('value pass to gallery.js', view)
    if(view == 'class'){

        $('#upload-img input[name="group-id"]').attr('value', 0)
        $('.card.gallery #gallery-group-heading').text('All Submission'); //update the sub-title of gallery page

        displayGallery(0)

    }else{


        //TODO: check if 'group' was selected before

        console.log('total number of group (gallery.js): ', number_of_group)

        $('.card.active').removeClass('active');
        $('.card.group').addClass('active');

        //clear previous items
        $('#group-view').empty();

        //add radio button dynamically
        for (i = 1; i <= number_of_group; i++) {
            $('<input type="radio" name="radiogroup" value="'+i+'"/> Group '+ i +'</br>').appendTo('#group-view');
         }

        //get group id from the radio button
        var groupValue
        $("input[name='radiogroup']").change(function(){
            groupValue = $("input[name='radiogroup']:checked").val();
            if(groupValue){
                    //pass group value in the form so it can be added into the database
                    $('#upload-img input[name="group-id"]').attr('value', groupValue)

                    console.log('group ID :: ', groupValue) //debug
                    $('.card.group').removeClass('active');
                    $('.card.gallery').addClass('active');

                    //update the sub-title of gallery page
                    $('.card.gallery #gallery-group-heading').text('Group #'+groupValue+' Submission');

            }

            displayGallery(groupValue)
        })
    }
}

var openImageView = function(galleryView, image){

    //console.log('openImageView', galleryView)
    var singleImageViewer = $('#single-image-view');

    // Toggle views: Display or hide the matched elements.
    $('.gallery-panel', galleryView).toggle();

    // Get image element and add it to the DOM
    var image = image.clone();

    //remove previous single image before adding new one
    $('.section').children('img').remove();

    $('.section', singleImageViewer).append(image);
    //console.log($('#single-image-view').html())

};

function displayGallery(groupValue){

        //get the logged in user
        $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getUsername/',
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                logged_in  = e.name
                console.log('logged in username (inside) :: ', logged_in)
            }
        })


        $.ajax({

           type:'GET',
           url:'http://'+ host_url +'/getImage/'+groupValue, //get all the image for the particular group
           success: function(response){

           //TODO: update user with a 'success' message on the screen

           img_data = response.success;
           var obj = jQuery.parseJSON(img_data);

           $('#gallery').empty();

           $.each(obj, function(key,value) {

               // console.log(value.fields) //gives all the value
               // console.log(value.fields['image']); //image field in the model
               // console.log("building gallery from scratch")

//               console.log(logged_in, value.fields['posted_by'][0])
//
//               console.log('primary id::',value.pk)
//
//               console.log('total number of images: ', obj.length)

               var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

//               var img = $('<img/>', {
//                   src : 'http://'+ host_url +'/media/'+value.fields['image'] }).appendTo(li);



                  if(logged_in == value.fields['posted_by'][0]){
                   var img = $('<img/>', {
                   src : 'http://'+ host_url +'/media/'+value.fields['image'] }).css({opacity:1.0}).appendTo(li);
                }else{
                    var img = $('<img/>', {
                   src : 'http://'+ host_url +'/media/'+value.fields['image'] }).appendTo(li);
                }



               // Add clickhandler to open the single image view
               img.on('click', function(event){
                   console.log($(this))
                   //console.log($(this).parent().siblings().length); //+1 gives me the total number of images in the gallery
                   //console.log($(this).parent().index())
                   $('.section input[name="image-index"]').attr('value', $(this).parent().index())
                   $('.section input[name="image-db-pk"]').attr('value', value.pk)
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

