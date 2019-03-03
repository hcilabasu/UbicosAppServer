var current_pagenumber = 1 //initial page number; gets updated with page change
var type = '' //card type
var groupArray = ['A', 'B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
var activity_id


window.onerror = function(message, file, line) {
  console.log('An error occured at line ' + line + ' of ' + file + ': ' + message);
  enterLogIntoDatabase('error', 'error' , 'An error occured at line ' + line + ' of ' + file + ': ' + message, 9999)
  //alert('an error')
  return false;
};

/*
    This variable is key in the functioning of the page navigation functionality.
    It is also used in:
    * activityindex.js
*/
var NUM_PAGES = 12;


$(function(){

    //localStorage.clear();

    var host_url = window.location.host

    console.log('page load');

    $('.close-card').on('touch click', function(){

        var classNameWhichisClosed = $(this).offsetParent()[0].className.split(" ")[1]
        //user logging
        enterLogIntoDatabase('card close', classNameWhichisClosed, 'none', current_pagenumber)
        $(this).closest('.card').removeClass('active');

    });

    $('.extend-card').on('touch click', function(){

        card_extension();

        var classNameWhichisExtended = $(this).offsetParent()[0].className.split(" ")[1]
        enterLogIntoDatabase('card extend', classNameWhichisExtended, 'none', current_pagenumber)

    });



    //update activity feed with history of messages
    loadFeed(0); //call function from activity.js //0 means all; 1 means todays chat


    // Load first pages
    // TODO the URL should indicate which page to be loaded instead of always loading pages 1 and 2
    loadPage(1, $('.page:not(.previous):not(.next)'));
    loadPage(2, $('.page.next'));

    // If we start loading the cards dynamically, this needs to be called after the brainstorm card is built
    setupBrainstorm();

    loadActivityIndex();

    //toggle between activity feed and index
    $('#main-view-toggle').click(function(){
        var hidden = $('.main-view:hidden');
        $('.main-view:visible').fadeOut('fast', function(){
            hidden.fadeIn('fast');
        });
        $(this).toggleClass('pressed');

        //TODO: add user log
        enterLogIntoDatabase('click', 'activity index', 'none', current_pagenumber)
    });

    $('#feed-toggle').click(function() {
            $(this).toggleClass('pressedf');
            if ($(this).hasClass("pressedf")){
                loadFeed(1);
            }else{
                loadFeed(0);
            }
     });

     //left-right key press event -- page transition -- not working right, check later
//     $('html').keydown(function(e){
//       if(e.which == 39) movePage(true); //go right
//       else movePage(false);
//     });


    //check localstorage - used for refresh

      if(localStorage.getItem("pageToBeRefreshed")){

        var pageToBeRefreshed = localStorage.getItem("pageToBeRefreshed");

        var gotoPage = pageToBeRefreshed;
        var container = $('#textbook-content');

        // Update current page
        loadPage(
            gotoPage,
            $('.page:not(.previous):not(.next)'),
            function(){
                // Update container class if this is the last or the first page
                var containerClass = ''
                if(gotoPage == 1) containerClass = 'first';
                else if(gotoPage == NUM_PAGES) containerClass = 'last'; // NUM_PAGES is defined in digTtextBook.js
                container.attr('class',containerClass);
                // Change page number
                $("#page-control-number").text('Page ' + gotoPage + '/' + NUM_PAGES);
            });
        // Update previous and next
        loadPage(parseInt(gotoPage)+1, $('.page.next'));
        loadPage(gotoPage-1, $('.page.previous'));

      }else{

      }


});


var movePage = function(moveToNext){


    var container = $('#textbook-content'),
        pageToHide = $('.page:not(.previous):not(.next)', container), // This the current page, which will be hidden
        pageToShow, // This is the page that will be shown next
        pageToReplace, // this is the page whose content will need to be updated
        currentNewClass, // this is the new class that will be applied to the current page
        currentPageNum, // Page number of the page that will be shown
        replacePageNum, // Number of the new page to be dynamically loaded
        noMoreClass; // Class that will be added to container if 
    if(moveToNext === true){
        pageToShow = $('.page.next', container);
        pageToReplace = $('.page.previous', container);
        currentNewClass = 'previous';
        replaceNewClass = 'next';
        currentPageNum = parseInt(pageToShow.data('page'));
        replacePageNum = currentPageNum + 1;
        noMoreClass = 'last';
    } else {
        pageToShow = $('.page.previous', container);
        pageToReplace = $('.page.next', container);
        currentNewClass = 'next';
        replaceNewClass = 'previous';
        currentPageNum = parseInt(pageToShow.data('page'));
        replacePageNum = currentPageNum - 1;
        noMoreClass = 'first';
    }
    // Replace page number
    console.log("current page", currentPageNum)
    current_pagenumber = currentPageNum
    localStorage.setItem("pageToBeRefreshed", currentPageNum);
    $("#page-control-number").text('Page ' + currentPageNum + '/' + NUM_PAGES);


    //close any card with page navigation
    if(type!=''){
        $('.card.' + type).removeClass('active');
    }



    // Do swaps
    pageToHide.attr('class','page').addClass(currentNewClass); // Turn the current page into either next or previous
    pageToShow.attr('class','page');
    pageToReplace.attr('class','page').addClass(replaceNewClass);

    // Replace page to replace content
    loadPage(
        replacePageNum, 
        pageToReplace, 
        function(){
            container.attr('class','');
        },
        function(){
            container.attr('class', noMoreClass);
        });
};

var loadPage = function(pageNum, pageContainer, successFn, notFoundFn){
    //console.log('next page (loadPage Function)', pageNum)

    loadHTML(
        API_URL.pagesBase + '/' + pageNum + '.html',
        function(data){

            var pageHTML = $(data) //convert data into jquery object

            //console.log(pageHTML)

            if($('img', pageHTML)){

                var imgsrc = $('img', pageHTML).attr('src') //get the image src from the html i.e. '/act2/1.png'
                $('img', pageHTML).attr('src', API_URL.picsBase + imgsrc); //append the base url in the front
            }

            pageContainer.html(pageHTML);
            pageContainer.data('page', pageNum);

            if(successFn){
                successFn();
            }

            bindActivityButtons();
        },
        function (xhr, ajaxOptions, thrownError){
            if(xhr.status==404) {
                console.dir('Page not found');
                if (notFoundFn){
                    notFoundFn();
                }
            }
        }
    );
}

var loadHTML = function(url, successFn, errorFn){
    $.ajax({
        method: 'GET',
        url: url,
        success:successFn,
        error:errorFn
    });
};



var bindActivityButtons = function(){

    $('.page a').off().on('touch click', function(){
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
        activity_id = id; //passing it to teacherindex.js
        //console.log('id', id)

        // Disable current card and enable new card
        $('.card.active').removeClass('active');
        $('.card.' + type).addClass('active');

        // based on the activity type, update titles in html
        $('.card.' + type + ' h1').text(type + ' #'+id); //update the title of each page

//        ------------------------------teacher dashboard gallery-----------------------
        $('.teacher-view-toggle').off().on('click', function(){

            var activity_id = activityButton.attr('data-id');

            $('.card.active').removeClass('active');
            $('.card.teacher').addClass('active');

            loadtable(activity_id);
            card_extension();

        })
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

              //if the card is already extended, put it back to normal
              card_extension_close();

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
            $('.card.' + type + ' h1').text(activityButton.attr('data-heading') + ' Group ' + groupArray[user_group_id-1]);

           //update the description
           console.log(activityButton.attr('data-description'));
           if(activityButton.attr('data-description')){
                $('.card.' + type + ' p#gallery-description').text(activityButton.attr('data-description'));
            }
            else{
                $('.card.' + type + ' p#gallery-description').text('Take a picture of your solution using "Open Camera". It will be downloaded to the "Downloads" folder. Upload the picture in your gallery.');
            }

            //update the submission heading
            $('#gallery-group-heading').text('My Submissions')

            //highlight the all submission  button and unhighlight the my submission
            $("#mySubmission").css('background-color', '#006600');
            $("#allSubmission").css('background-color', '#2DB872');
            $("#groupSubmission").css('background-color', '#2DB872');

            //since the card opens to my submission -- show user upload options
            //display upload image from here
             $('#gallery-user-submission').hide();
             $('#add-new-gallery-post').show();


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
            viewDiv("class", user_group_id);

            //indicate that its not a middleGroupDiscussion -- variable used to extract comments as needed
            //defined in gallery.js (top)
            middleGroupDiscussion = 'no';

            //teacher-view handle
            //TODO: Can transfar ajax request to gallery.js inside populate function
            if(logged_in == 'AW'){
                $("#teacher-view").css("display", "block");
                 $.ajax({
                    type:'GET',
                    url:'http://'+ host_url +'/randomDiscussionList',
                    async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
                    success: function(e){

                        console.log(e.list);
                        populateTeacherViewDiv(e.list); //defined in gallery.js
                    }
                });
            }



            //if the card is already extended, put it back to normal
            card_extension_close();
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

            //if the card is already extended, put it back to normal
            card_extension_close();

        }

//        ------------------------------MORE INFO (TALK MOVES)-----------------------
        if($('.card.moreinfo').hasClass('active')){

             //$('input[name="table-id"]').attr('value', id)
             $('.card.' + type + ' h1').text("Talk Moves"); //update the title of each page

            //if the card is already extended, put it back to normal
             card_extension_close();
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

            //if the card is already extended, put it back to normal
            card_extension_close();
        }

//        ------------------------------Khan Academy-----------------------
        if($('.card.khanacademy').hasClass('active')){
            $('.card.' + type + ' h1').text("Khan Academy");

            //at all times the card will be expanded; so no call to card expansion method
            $('.card').css({'width':'100%'});

            $('input[name="ka-act-id"]').attr('value', id)
            //pass the ka-url and heading
            //console.log('ka-url-passing to html', activityButton.attr('data-video-url'))
            $('a#ka-form-url').attr('href', activityButton.attr('data-video-url'))
            $('a#ka-form-url').text(activityButton.attr('data-video-topic'))

             //check for persistence
             $.get({
               async: false,
               url:'/checkKAAnswer/'+activity_id,
               success: function(response){

                    persistence_check(response.success)
                }

            });
      }

        //user logging
        enterLogIntoDatabase('activity select', type , 'activity-id-'+id, current_pagenumber)


    });
};

var loadActivityIndex = function(){
    //TODO: call the parser here using ajax request, parse the files and build activity index

}

var card_extension = function(){

    var width = $(".card").width() / $('.card').parent().width() * 100
    width = width/2;

    if (width == 50){
        $('.card').css({'width':'100%'});
    }else{
        $('.card').css({'width':'50%'});
    }

}

var card_extension_close = function(){

    var width = $(".card").width() / $('.card').parent().width() * 100
    width = width/2;

    if (width == 100){
        $('.card').css({'width':'50%'});
    }

}

