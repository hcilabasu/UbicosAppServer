$(function(){



    $('.teacherpage a').click(function(){
        console.log('link clicked')
        var activityButton = $(this);
        //type of activity - gallery/brainstorm/video etc
        type = activityButton.attr('class').replace('activity-button','').trim();
        console.log('type', type)
        $('.card.' + type).addClass('active');
    })



})

var bindActivityButtons = function(){

    $('.teacherpage a').click(function(){
        print('from teacher page')
        // Get button type to open appropriate view
        //console.log('this', this)
        //console.log('$(this)', $(this))

        var activityButton = $(this);

        //type of activity - gallery/brainstorm/video etc
        type = activityButton.attr('class').replace('activity-button','').trim();
        console.log('type', type)

        //for brainstorm different instances - start
        if(type.indexOf("msf")>=0){
            console.log(type)
            type = type.split(" ")[0]
        }
        if(type.indexOf("bs")>=0){
            console.log(type)
            type = type.split(" ")[0]
        }
        //for brainstorm different instances - start


        //id of each each activity - based on page no
        var id = activityButton.attr('data-id');
        console.log('id', id)

        // Disable current card and enable new card
        $('.card.active').removeClass('active');
        $('.card.' + type).addClass('active');

        // based on the activity type, update titles in html
        $('.card.' + type + ' h1').text(type + ' #'+id); //update the title of each page


//        ------------------------------based on different tools-----------------------
        // TODO: make the following if dynamic

//        ------------------------------VIDEO-----------------------
        // if video tab is active get the video url and display in video.html
        //display the video url in a new tab instead of the card
        if(type == 'video'){
            $('.card.active').removeClass('active');
            var video_url = activityButton.attr('data-video-url');
            window.open(video_url, '_blank'); //open paint splash game in a new window
        }
//        ------------------------------TABLE-----------------------
        //if the table tab is active
        if($('.card.table').hasClass('active')){


             $('input[name="table-id"]').attr('value', id)
             $('.card.' + type + ' h1').text('Data #' +id );

              //persistence checker and populate or clear the table according to that


              if(localStorage.getItem('table'+$('input[name="table-id"]').val())){
                var points = localStorage.getItem('table'+$('input[name="table-id"]').val());

                //if table 3 has 3 pairs, and table 2 has 2 pairs, coming back to table 2 from table 3 shows the third coloumn from table3
                //so clear everything and populate with the values
                clearTableStatus();
                //table already populated before, so display them in the table
                persistTableStatus(points)


              }else{
                //used to clear the table for different instance of the table
                clearTableStatus();
              }

              //
              //$('div#graph-container').css("display", "none");


        }
//        ------------------------------GALLERY-----------------------
        // if gallery div is active, load the gallery
        if($('.card.gallery').hasClass('active')){

            // pass id to gallery activity - to upload image form in gallery.html
            $('#upload-img input[name="act-id"]').attr('value', id)

            var user_group_id
            $.ajax({
                type:'GET',
                url:'http://'+ host_url +'/getGroupID/'+$('input[name="act-id"]').val(),
                async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
                success: function(e){
                    user_group_id = e;
                    console.log("my group id (digtextBook.js),", e)
                }
            });

            console.log(activityButton.attr('data-heading'));

            //update the heading
            $('.card.' + type + ' h1').text(type + ' #'+id + ' Group ' + groupArray[user_group_id-1]);

           //update the description
           console.log(activityButton.attr('data-description'));
           if(activityButton.attr('data-description')){
                $('.card.' + type + ' p#gallery-description').text(activityButton.attr('data-description'));
            }
            else{
                $('.card.' + type + ' p#gallery-description').text('Take a picture of your solution using "Open Camera". It will be downloaded to the "Downloads" folder. Upload the picture in your gallery.');
            }

            //update the submission heading
            $('#gallery-group-heading').text('All Submissions')

            //highlight the all submission  button and unhighlight the my submission
            $("#allSubmission").css('background-color', '#006600');
            $("#mySubmission").css('background-color', '#2DB872');

            //gallery 1 card stays open if explicitly not closed and you go to gallery 2.
            //with each click hide the single image view
            $('#gallery-panel').show();
            $('#single-image-view').hide();
            //https://stackoverflow.com/questions/52430558/dynamic-html-image-loading-using-javascript-and-django-templates
            $('img#default').attr('src', API_URL.picsBase + "/default.png");
            // end of the solution




            var view = activityButton.attr('data-view');
            console.log('view: ', view)

            //var user_group_id = activityButton.attr('data-group');

            //call function from gallery.js
            $("input[name='group-id']").attr('value', user_group_id);
            viewDiv(view, user_group_id);
        }

//        ------------------------------ANSWER-----------------------
        if($('.card.multQues').hasClass('active')){

            //get which question clicked.
            console.log(id)
            //hide its siblings

            //if problem list - then hide the answer description and heading
            $('.card.' + type + ' h1').text('Answer Questions');


            $('#'+id).siblings().hide();
            //show the div
            $('#'+id).show();


            //TODO: call loadHTML() from here

        }

//        ------------------------------MORE INFO (TALK MOVES)-----------------------
        if($('.card.moreinfo').hasClass('active')){

             //$('input[name="table-id"]').attr('value', id)
             $('.card.' + type + ' h1').text("Talk Moves"); //update the title of each page
        }

//        ------------------------------BRAINSTORM-----------------------
        if($('.card.brainstorm').hasClass('active')){

            //update the heading
            console.log('brainstorm heading:: ', activityButton.attr('data-heading'))
            $('.card.' + type + ' h1').text(activityButton.attr('data-heading')); //update the title of each page


            //update the description
           console.log(activityButton.attr('data-description'));
           if(activityButton.attr('data-description')){
                $('.card.' + type + ' p#brainstorm-description').text(activityButton.attr('data-description'));
            }

            console.log($(this))
            $('input[name="brainstorm-id"]').attr('value', id)

            loadIdeaToWorkspace();
        }

        //user logging
        enterLogIntoDatabase('activity select', type , 'activity-id-'+id, current_pagenumber)


    });
};