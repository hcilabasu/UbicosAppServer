    $(function(){

        console.log('page load');

        $('.page a').on('touch click', function(){

            // Get button type to open appropriate view
            //console.log('this', this)
            //console.log('$(this)', $(this))

            var activityButton = $(this);

            //type of activity - gallery/brainstorm/video etc
            var type = activityButton.attr('class').replace('activity-button','').trim();
            console.log('type', type)

            //id of each each activity - based on page no
            var id = activityButton.attr('data-id');
            console.log('id', id)

            // Disable current card and enable new card
            $('.card.active').removeClass('active');
            $('.card.' + type).addClass('active');

            // based on the activity type, update titles in html
            $('.card.' + type + ' h1').text(type + ' #'+id); //update the title of each page

            // if video tab is active get the video url and display in video.html
            if($('.card.video').hasClass('active')){

                var video_url = activityButton.attr('data-video-url');
                console.log(video_url);
                $('#videoFrame').attr('src', video_url); //display in video.html
            }

            // pass id to gallery activity - to upload image form in gallery.html
            $('#upload-img input[name="act-id"]').attr('value', id)

            // if gallery div is active, load the gallery
            if($('.card.gallery').hasClass('active')){

                console.log("i am gallery and I am active");

                $('.group-view').show();

                //get group id from the radio button
                var groupValue
                $("input[name='group']").change(function(){
                    groupValue = $("input[name='group']:checked").val();
                    if(groupValue){
                        $('#upload-img input[name="group-id"]').attr('value', groupValue)
                        console.log('group ID :: ', groupValue)
                    }
                    //deactivate the div group-view
                    $('.group-view').hide()

                      $.ajax({

                        type:'GET',
                        url:'http://127.0.0.1:8000/getImage/'+groupValue,
                        //url:'src : 'http://hcilabasu.pythonanywhere.com/getImage/'
                        success: function(response){

                            //TODO: update user with a 'success' message on the screen

                            //console.log('success:', response.success);
                            img_data = response.success;

                            var obj = jQuery.parseJSON(img_data);

                            console.log($("#gallery li").length);

                            //if already gallery generated, then do nothing
                            if($("#gallery li").length > 0){

                            }
                            else {  //if no gallery, then generate the gallery

                                $.each(obj, function(key,value) {

                                  //console.log(value.fields) //gives all the value
                                  //console.log(value.fields['image']); //image field in the model

                                    var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

                                    var img = $('<img/>', {
                                             src : 'http://127.0.0.1:8000/media/'+value.fields['image'] }).appendTo(li);
                                             //src : 'http://hcilabasu.pythonanywhere.com/media/'+value.fields['image'] }).appendTo(li);

                                    var span = $('<span/>', {
                                        text: value.fields['gallery_id']}).appendTo(li);

                                    span.addClass('badge');

                                });

                                //reverse the image order
                                var list = $('#gallery');
                                var listItems = list.children('li');
                                list.append(listItems.get().reverse());

                            }

                        }

                      });
                })

            }

        });



        $('.close-card').on('touch click', function(){
            $(this).closest('.card').removeClass('active');
        });


        //update activity feed with history of messages
        $.ajax({

            type:'GET',
            url:'http://127.0.0.1:8000/updateFeed/',
            //url : 'http://hcilabasu.pythonanywhere.com/updateFeed/',
            success: function(response){

                var logged_in_user = response.username //passed from views.py - updateFeed

                msg_data = response.success
                var obj = jQuery.parseJSON(msg_data);

                //console.log(obj)

                $.each(obj, function(key, value){

                    //  add in the thread itself
                    var li = $("<li/>").appendTo(".feed");
                    if(value.fields['posted_by'] == logged_in_user){
                        li.addClass('message self');
                    }else{
                        li.addClass('message');
                    }

                    var div = $("<div/>").appendTo(li);
                    div.addClass('user-image');

                    var span = $('<span/>', {
                        text: value.fields['posted_by']}).appendTo(div);

                    var p = $('<p/>', {
                            text: value.fields['content']}).appendTo(li);
                });

                // Scroll page to bottom
                $('#dynamic-content').animate({ scrollTop: $('.feed').height() }, 400);
            }

        });



    })