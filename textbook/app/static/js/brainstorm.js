 $( function() {

    $("#new-note-form").hide();

    $('#new-idea').on("click",function(e){

        e.preventDefault();
        console.log($(this));

        $("#new-note-form").show();

        $('#create-note-btn').click(function() {

            //TODO: create draggable object dynamically and append to the existing list
            //see this: https://stackoverflow.com/questions/18789354/how-do-i-make-dynamically-created-elements-draggable

            //add the text to the object
            $('#draggable p').text($('textarea[name="note-input"]').val())

        });




    })
    $( "#draggable" ).draggable();
  } );