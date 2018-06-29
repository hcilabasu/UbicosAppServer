 $( function() {

    ideaDragPositionUpdate();



  } );

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
        //send to database
        saveBrainstormNote(idea, color, hideName, posTop, posLeft);
        return false; //why return false?
    });
};

var saveBrainstormNote = function(idea, color, hideName, posTop, posLeft){


      $.post({
                url: '/brainstorm/save/',
                data: {
                'idea': idea,
                'color': color,
                'posTop': posTop,
                'posLeft': posLeft
                },
                success: function (data) {





                }
            });

}

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

var ideaDragPositionUpdate = function(){

    //detect when an idea is stopped dragging to get the final location
    //and save it into the database
    //http://api.jqueryui.com/draggable/#event-start
    $( ".idea" ).on( "dragstop", function( event, ui ) {


        //find the id of the note - which is used to update the note in the database
        //console.log($(this).find("input[name='note-id']").attr('value'))
        console.log("idea dragged", ui.position )



     } );

}