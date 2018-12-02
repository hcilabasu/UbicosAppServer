
var host_url = window.location.host;
var brainstormID

$( function() {

    //channel for brainstorm note
     var pusher_brainstorm = new Pusher('5da367936aa67ecdf673',{
        cluster: 'us2',
        encrypted: true
     });

    //subscribe to the channel you want to listen to
    var my_channel_brainstorm = pusher_brainstorm.subscribe('c_channel');

    my_channel_brainstorm.bind("cn_event", function (data) {


      if(data.update === "true"){
            console.log("@@inside here")
            loadIdeaToWorkspace();

      }else{
         if(logged_in == data.posted_by){
           addIdeaToWorkspace(data.idea, data.color, data.posted_by, {top:data.posTop,left:data.posLeft}, data.noteID, true, true);
        }else{
           addIdeaToWorkspace(data.idea, data.color, data.posted_by, {top:data.posTop,left:data.posLeft}, data.noteID, true, false);
        }
      }


    });

 ideaDragPositionUpdate();


} ); //end of page load function

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

    // Handle current submission
    $('#new-idea form .btn').off().click(function(){

        // TODO validate

        // Get values
        var form = $('#new-idea form');
        var idea = $('textarea', form).val();
        var color = $('.colorpicker.active', form).css('background-color');
        //var hideName = $('#hidename', form).is(':checked');

        // Calculate center position:
        var workspace = $('#idea-workspace');
        height = workspace.height();
        width = workspace.width();
        posTop = height / 2 - 85; // These modifier (85) should probably be calculated dynamically
        posLeft = width / 2 - 85;

        // Submit idea
        toggleNewIdeaButton();

        if(!idea){
            console.log('enter values');
            alert('enter values');

        }else{
             //send to database
             //saveBrainstormNote(idea, color, hideName, posTop, posLeft);
              $.post({
                    url: '/brainstorm/save/',
                    data: {
                    'username': logged_in,
                    'brainstormID': $("input[name='brainstorm-id']").val(),
                    'idea': idea,
                    'color': color,
                    'posTop': posTop,
                    'posLeft': posLeft
                    },
                    success: function (data) {

                        noteID = data.id
                        //addIdeaToWorkspace(idea, color, logged_in, {top:posTop,left:posLeft}, noteID, true, true);
                        //clear the input field
                        $('textarea', form).val('');
                        //user logging
                        enterLogIntoDatabase('Add Note', 'brainstorm add note '  , idea , current_pagenumber)

                    }
            });
        }


        return false; //why return false?
    });
}; //end of setupBrainstorm


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
var addIdeaToWorkspace = function(idea, color, name, position, noteID, animate, isItYours){

    // Create idea
    var idea = $('<div class="idea new"></div>')
        .text(idea)
        .css('background', color)
        .css('top', position.top + 'px')
        .css('left', position.left + 'px')
        .data('noteid',noteID) //add id
        .append('<span class="brainstorm_name ">Added by '+ name +'</span>'); //add username in the right end corner


        if(isItYours == true){

             idea.addClass('idea-owner');
             //add delete button to notes
             idea.append('<span class="object_delete"></span>')

             //add delete button to notes
             var closeBtn = $('<span class="object_delete"></span>');


           closeBtn.click(function(e){

               e.preventDefault();

               //get ID of the deleted note
               var deletedNoteID = $(this).parent().data('noteid');
               console.log(deletedNoteID);
               $(this).parent().remove();



              //delete note from database
                $.ajax({
                    type:'POST',
                    url:'/brainstorm/del/'+deletedNoteID,
                    async: false, //wait for ajax call to finish,
                    success: function(e){
                        console.log(e)
                        enterLogIntoDatabase('Delete Note', 'brainstorm delete note' , deletedNoteID , 3333)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(XMLHttpRequest.status+" "+XMLHttpRequest.statusText);
                            enterLogIntoDatabase('Attempted delete note', 'error' , XMLHttpRequest.status+" "+XMLHttpRequest.statusText, 3333);

                        }
            })
               return false;
           });

           idea.append(closeBtn);
        }



    // Add to workspace
    $('#idea-workspace').append(idea);
    // Make it draggable
    idea.draggable(draggableConfig);
    // Remove new class
    idea.removeClass('new');


    ideaDragPositionUpdate();


}

var ideaDragPositionUpdate = function(){


    //detect when an idea is stopped dragging to get the final location
    //and save it into the database
    //http://api.jqueryui.com/draggable/#event-start
    //console.log('total idea divs',$(".idea").length) //debug purpose - remove later

    $( ".idea" ).on( "dragstop", function( evt, ui ) {
        //https://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times
        evt.stopImmediatePropagation();

        //find the id of the note - which is used to update the note in the database
        noteID = $(this).data('noteid')
        console.log('dragged note :: ',noteID)

        enterLogIntoDatabase('Dragged Note', 'brainstorm note dragged' , JSON.stringify(ui.position) , current_pagenumber)


         $.post({

           async: false,
           url:'/brainstorm/update/'+noteID+'/', //update location of the dragged note
           data: {
                'left': ui.position.left,
                'top': ui.position.top,
                'username': logged_in
                },
           success: function(response){

            loadIdeaToWorkspace()

        }

        });


     } );

       //when idea is hovered, differentiate with other notes to the user
     $( ".idea" ).hover(function() {
          $(this).css('border', '3px solid black')
        }, function() {
            $(this).css('border', '');
        });

        $( ".idea" ).click(function(evt) {
          //https://stackoverflow.com/questions/31891612/how-can-bring-to-front-clicked-div-in-jquery
          evt.stopImmediatePropagation();
          $(this).css('z-index', '20');
          $(this).siblings().css('z-index', '1');
          //console.log($(this).contents())
        });

}


var loadIdeaToWorkspace = function(){

    brainstormID = $("input[name='brainstorm-id']").val();
    var notes

     $.get({

         url:'/brainstorm/get/'+brainstormID, //get all the notes
         success: function(data){

                //console.log(data.success)
                notes = data.success;
                notes = jQuery.parseJSON(notes);

                //clear the workspace
                $('#idea-workspace').empty()

                //loop through and display notes
                $.each(notes, function(key, value){

                    var isItYours = ''

                    if(logged_in == value.fields['posted_by'][0]) {
                        //console.log(logged_in)
                        isItYours = true
                    }else isItYours = false

                    addIdeaToWorkspace(value.fields['ideaText'], value.fields['color'], value.fields['posted_by'][0], {top:value.fields['position_top'],
                            left:value.fields['position_left']}, value.pk, false,  isItYours);

                })

                //ideaDragPositionUpdate();

            }

        });

        //ideaDragPositionUpdate();

}