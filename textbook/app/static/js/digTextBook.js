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
        // $('.card.' + type).css('transform','none');
        console.log('touch');


        //based on the activity type, update titles and html elements
        if(type == 'video'){
            $('#h1-title').text('Video #'+id); //update the title of each page //this does not work
            console.log("i am here Video inside if-why dont you update h1?")
        }
        else if(type == 'brainstorm'){
            $('#h1-title').text('Brainstorming #'+id); //this does not work
        }
        else if(type == 'gallery'){
            $('#h1-title').text('Gallery #'+id) //this works
            $('.badge').text(id); //update badge in gallery.html with the id
            $('input[name="id"]').attr('value',id);
        }

    });

    $('.close-card').on('touch click', function(){
        $(this).closest('.card').removeClass('active');
    });






})