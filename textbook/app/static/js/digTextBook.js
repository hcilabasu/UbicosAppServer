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

});

/*
Params:
* galleryView: the top container for the gallery, holding both the gallery overview and individual images view
IMPORTANT: this, along with the gallery building file, should be moved to gallery.js
*/
var openImageView = function(galleryView, image){
    var singleImageViewer = $('#single-image-view');
    // Toggle views
    $('.gallery-panel', galleryView).toggle();
    // Get image element and add it to the DOM
    var image = image.clone();
    $('.section', singleImageViewer).append(image);
};

var movePage = function(moveToNext){
    var container = $('#textbook-content'),
        pageToHide = $('.page:not(.previous):not(.next)', container), // This the current page, which will be hidden
        pageToShow, // This is the page that will be shown next
        pageToReplace, // this is the page whose content will need to be updated
        currentNewClass, // this is the new class that will be applied to the current page
        replacePageNum, // Number of the new page to be dynamically loaded
        noMoreClass; // Class that will be added to container if 
    if(moveToNext === true){
        pageToShow = $('.page.next', container);
        pageToReplace = $('.page.previous', container);
        currentNewClass = 'previous';
        replaceNewClass = 'next';
        replacePageNum = parseInt(pageToShow.data('page')) + 1;
        noMoreClass = 'last';
    } else {
        pageToShow = $('.page.previous', container);
        pageToReplace = $('.page.next', container);
        currentNewClass = 'next';
        replaceNewClass = 'previous';
        replacePageNum = parseInt(pageToShow.data('page')) - 1;
        noMoreClass = 'first';
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
    $.ajax({
        method: 'GET',
        url: API_URL.pagesBase + '/' + pageNum + '.html',
        success: function(data){
            pageContainer.html(data);
            pageContainer.data('page', pageNum);
            if(successFn){
                successFn();
            }
            bindActivityButtons();
        },
        error: function (xhr, ajaxOptions, thrownError){
            if(xhr.status==404) {
                console.dir('Page not found');
                if (notFoundFn){
                    notFoundFn();
                }
            }
        }
    });
}

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

            //call function from gallery.js
            viewDiv(view);
        }

        if($('.card.multQues').hasClass('active')){

            $('.act2ques').hide()
            //get which question is clicked and activate that div
            var quesno = activityButton.attr('data-quesid');
            console.log('clicked',quesno)
            $('div[data-quesno="'+quesno+'"]').show()

        }

    });
};

var draggableConfig = {
    scroll: true
};

var setupBrainstorm = function(){
    // Make ideas draggable
    $('#idea-workspace .idea').draggable(draggableConfig);

    // Handle new idea popup
    $('#new-idea .toggle').click(function(){
        toggleNewIdeaButton();
    })

    // Handle color picker
    $('#new-idea .colorpicker').click(function(){
        $('#new-idea .colorpicker.active').removeClass('active');
        $(this).addClass('active');
    });

    // Handle submission
    $('#new-idea form .btn').click(function(){
        // TODO validate

        // Get values
        var form = $('#new-idea form');
        var idea = $('textarea', form).val();
        var color = $('.colorpicker.active', form).css('background-color');
        var hideName = $('#hidename', form).is(':checked');

        // Calculate center position:
        var workspace = $('#idea-workspace');
        height = workspace.height();
        width = workspace.width();
        posTop = height / 2 - 85; // These modifier (85) should probably be calculated dynamically
        posLeft = width / 2 - 85;

        // Submit idea
        toggleNewIdeaButton();
        addIdeaToWorkspace(idea, color, hideName, {top:posTop,left:posLeft}, true);
        return false;
    });
};

var toggleNewIdeaButton = function(){
    // Toggle main class
    $('#new-idea').toggleClass('button');
    $('#new-idea').toggleClass('popup');
    // Show or hide form
    $('#new-idea form').toggle('fast');
}

/*
    idea: the idea text
    color: color of the idea block
    hideName: whether the diea should show the name or not
    position: object with top and left number positions (i.e. {top:10, left:20})
    animate: whether the idea should be added with an animation or not
*/
var addIdeaToWorkspace = function(idea, color, hideName, position, animate){
    // Create idea
    var idea = $('<div class="idea new"></div>')
        .text(idea)
        .css('background', color)
        .css('top', position.top + 'px')
        .css('left', position.left + 'px');
    // Add to workspace
    $('#idea-workspace').append(idea);
    // Make it draggable
    idea.draggable(draggableConfig);
    // Remove new class
    idea.removeClass('new');
}   