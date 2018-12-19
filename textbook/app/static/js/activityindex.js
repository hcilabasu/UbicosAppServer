

$(function(){

    // Move to a given page if header is clicked
    $("#activity-index p, #activity-index ul li").click(function(){
        // Get page number
        console.log("clicked activity index header");

        var header = $(this);
        var gotoPage = parseInt(header.data('page'));
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

        localStorage.setItem("pageToBeRefreshed", gotoPage);
        // Update previous and next
        loadPage(gotoPage+1, $('.page.next'));
        loadPage(gotoPage-1, $('.page.previous'));
    });

    $('#activity-index a').off().on('touch click', function(){

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

        // TODO: make the following if dynamic
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

            //hide questions previously added in the DOM
            $('.act2ques').hide()

            //get which question is clicked and activate that div for question
            var quesno = activityButton.attr('data-quesid');
            $('div[data-quesno="'+quesno+'"]').show

            //TODO: call loadHTML() from here

        }

        if($('.card.brainstorm').hasClass('active')){
            loadIdeaToWorkspace();
        }

        //user logging
        enterLogIntoDatabase('click', type , 'none', 1111)

   });
})

