$(function(){

    var host_url = window.location.host

    console.log('page load');

    $('.close-card').on('touch click', function(){
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

    $('#main-view-toggle').click(function(){
        var hidden = $('.main-view:hidden');
        $('.main-view:visible').fadeOut('fast', function(){
            hidden.fadeIn('fast');
        });
        $(this).toggleClass('pressed');
    });

});

/*
Params:
* galleryView: the top container for the gallery, holding both the gallery overview and individual images view
IMPORTANT: this, along with the gallery building file, should be moved to gallery.js
*/


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
    $("#page-control-number").text('Page ' + currentPageNum);

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
    console.log('loadPage Function', pageNum)
    loadHTML(
        API_URL.pagesBase + '/' + pageNum + '.html',
        function(data){

            var pageHTML = $(data) //convert data into jquery object

            //console.log(pageHTML)

            //console.log("img", pageHTML)
            //console.log($('.imgtxtbook').children('img')) //returns the image object
            if($('img', pageHTML)){


                var imgsrc = $('img', pageHTML).attr('src') //get the image src from the html i.e. '/act2/1.png'
                //console.log(imgsrc)

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

        // if gallery div is active, load the gallery
        if($('.card.gallery').hasClass('active')){

            // pass id to gallery activity - to upload image form in gallery.html
            $('#upload-img input[name="act-id"]').attr('value', id)

            var view = activityButton.attr('data-view');
            console.log('view: ', view)

            var number_of_group
            if(view == 'group'){
                number_of_group = activityButton.attr('data-group-number');
               // console.log('number of group:' , number_of_group)
            }

            //call function from gallery.js
            viewDiv(view, number_of_group);
        }


        if($('.card.multQues').hasClass('active')){

            $('.act2ques').hide()
            //get which question is clicked and activate that div for question
            var quesno = activityButton.attr('data-quesid');
            console.log('you clicked',quesno)
            $('div[data-quesno="'+quesno+'"]').show()

        }

        if($('.card.brainstorm').hasClass('active')){
            console.log("here 1")
//            loadIdeaToWorkspace();
//            ideaDragPositionUpdate();
        }

    });
};

