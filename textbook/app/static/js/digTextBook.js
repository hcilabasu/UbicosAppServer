$(function(){
    
    console.log('page load');
    
    $('.page a').on('touch click', function(){
        // Get button type to open appropriate view
        var activityButton = $(this);
        var type = activityButton.attr('class').replace('activity-button','').trim();
        // Disable current card and enable new card
        $('.card.active').removeClass('active');
        $('.card.' + type).addClass('active');
        // $('.card.' + type).css('transform','none');
        console.log('touch');
    });

    $('.close-card').on('touch click', function(){
        $(this).closest('.card').removeClass('active');
    });

})