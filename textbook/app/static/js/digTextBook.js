$(function(){
    
    console.log('page load');
    
    $('.page a').on('touch click', function(){
        var type = $(this).attr('class').replace('activity-button','').trim();
        $('.card.' + type).addClass('active');
        // $('.card.' + type).css('transform','none');
        console.log('touch');
    });

    $('.close-card').on('touch click', function(){
        $(this).closest('.card').removeClass('active');
    });

})