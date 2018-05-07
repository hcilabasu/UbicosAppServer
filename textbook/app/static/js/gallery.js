
$(function(){

    $( "#upload-img" ).submit(function( event ) {

        event.preventDefault();

        var form_data = new FormData($('#upload-img')[0]);

        var img_data



        $.ajax({
              type:'POST',
              url:'http://127.0.0.1:8000/uploadImage/',
              processData: false,
              contentType: false,
              async: false,
              cache: false,
              data : form_data,
              success: function(response){
                //console.log('success:', response.success);
                img_data = response.success;

                var obj = jQuery.parseJSON(img_data);
                $.each(obj, function(key,value) {
                  //console.log(value.fields) //gives all the value
                  //console.log(value.fields['image']); //image field in the model

                    var li = $("<li/>").appendTo("#gallery");

                    var img = $('<img/>', {
                             //src : 'http://127.0.0.1:8000/media/'+value.fields['image'] }).appendTo(li);
                             src : 'http://127.0.0.1:8000/media/'+value.fields['image'] }).appendTo(li);

                    var span = $('<span/>', {
                        text: value.fields['gallery_id']}).appendTo(li);

                    span.addClass('badge');

                });

              }
          });



    });


    //update preview image
    $("#file-upload").change(function(){
        readURL(this);
    });

})

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#default').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

