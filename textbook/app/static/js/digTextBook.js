var current_pagenumber = 1 //initial page number; gets updated with page change
var type = '' //card type

/*
    This variable is key in the functioning of the page navigation functionality.
    It is also used in:
    * activityindex.js
*/
var NUM_PAGES = 10;

$(function(){

    var host_url = window.location.host

    console.log('page load');

    $('.close-card').on('touch click', function(){

        var classNameWhichisClosed = $(this).offsetParent()[0].className.split(" ")[1]
        //user logging
        enterLogIntoDatabase('card close', classNameWhichisClosed, 'none', current_pagenumber)
        $(this).closest('.card').removeClass('active');
    });


    //update activity feed with history of messages
    loadFeed(); //call function from activity.js

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
    });



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
    current_pagenumber = currentPageNum
    $("#page-control-number").text('Page ' + currentPageNum + '/' + NUM_PAGES);
    //user logging
    enterLogIntoDatabase('click', 'page change' , 'none', current_pagenumber)

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
    //console.log('loadPage Function', pageNum)

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

    $('input#page4-submit1').off().click(function(e){
         var answer = $("textarea[name='page4-input1']").val();
         console.log(answer);
         //TODO: save to db
        });

     $('#page4-submit2').off().click(function(e){
         var answer = $("textarea[name='page4-input2']").val();
         console.log(answer);
         //TODO: save to db
    });

    $('.page a').off().on('touch click', function(){
        // Get button type to open appropriate view
        //console.log('this', this)
        //console.log('$(this)', $(this))

        var activityButton = $(this);

        //type of activity - gallery/brainstorm/video etc
        type = activityButton.attr('class').replace('activity-button','').trim();
        console.log('type', type)

        //id of each each activity - based on page no
        var id = activityButton.attr('data-id');
        console.log('id', id)

        // Disable current card and enable new card
        $('.card.active').removeClass('active');
        $('.card.' + type).addClass('active');

        // based on the activity type, update titles in html
        $('.card.' + type + ' h1').text(type + ' #'+id); //update the title of each page

        // TODO: make the following if dynamic
        // if video tab is active get the video url and display in video.html
        //display the video url in a new tab instead of the card
        if(type == 'video'){
            $('.card.active').removeClass('active');
            var video_url = activityButton.attr('data-video-url');
            window.open(video_url, '_blank'); //open paint splash game in a new window
        }
//        if($('.card.video').hasClass('active')){
//
//            var video_url = activityButton.attr('data-video-url');
//            console.log(video_url);
//            //$('#videoFrame').attr('src', video_url); //display in video.html
//            window.open(video_url, '_blank');
//
//            //update h1
//
//        }
         if($('.card.table').hasClass('active')){

             $('input[name="table-id"]').attr('value', id)
        }

        // if gallery div is active, load the gallery
        if($('.card.gallery').hasClass('active')){

            console.log(activityButton.attr('data-heading'));
            if(activityButton.attr('data-heading')){
                $('.card.' + type + ' h1').text(type + ' #'+id + ' '+ activityButton.attr('data-heading'));
            }



            // pass id to gallery activity - to upload image form in gallery.html
            $('#upload-img input[name="act-id"]').attr('value', id)

            var view = activityButton.attr('data-view');
            console.log('view: ', view)

            var number_of_group = activityButton.attr('data-group');
//            if(view == 'group'){
//                number_of_group = activityButton.attr('data-group-number');
//               // console.log('number of group:' , number_of_group)
//            }

            //call function from gallery.js
            $("input[name='group-id']").attr('value', number_of_group);
            viewDiv(view, number_of_group);
        }


        if($('.card.multQues').hasClass('active')){

//            //hide questions previously added in the DOM
//            $('.act2ques').hide()
//
//            //get which question is clicked and activate that div for question
//            var quesno = activityButton.attr('data-quesid');
//            $('div[data-quesno="'+quesno+'"]').show()
            //get which question clicked.
            console.log('#'+id)
            //hide its siblings
            $('#'+id).siblings().hide();
            //show the div
            $('#'+id).show();

//
//            //TODO: call loadHTML() from here

        }

        if($('.card.brainstorm').hasClass('active')){

            $('.card.' + type + ' h1').text('Vocabulary'); //update the title of each page
            $('input[name="brainstorm-id"]').attr('value', id)


            loadIdeaToWorkspace();
        }

        //user logging
        enterLogIntoDatabase('click', type , 'id'+id, current_pagenumber)




    });
};

var loadActivityIndex = function(){
    //TODO: call the parser here using ajax request, parse the files and build activity index

}