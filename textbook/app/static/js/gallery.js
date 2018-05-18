
$(function(){


    $("#file-upload").change(function(event){

        console.log("file changed");

        var form_data = new FormData($('#upload-img')[0]);
        console.log('form_data', form_data)

        var img_data

        //ajax call to post the uploaded image in the database and with successful entry show the image at the beginning of the list
        $.ajax({
              type:'POST',
              url:'http://'+ host_url +'/uploadImage/',
              //url: src : 'http://hcilabasu.pythonanywhere.com/uploadImage/'
              processData: false,
              contentType: false,
              async: false,
              cache: false,
              data : form_data,
              success: function(response){

                //TODO: update user with a 'success' message on the screen
                //alert('your photo is successfully uploaded')
                //console.log('success:', response.success);
                img_data = response.success;


                var obj = jQuery.parseJSON(img_data);

                console.log(obj)

                    var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

                    var img = $('<img/>', {
                             //src : 'http://127.0.0.1:8000/media/'+value.fields['image'] }).appendTo(li);
                             src : 'http://'+ host_url +obj.url }).appendTo(li);
                             //src : 'http://hcilabasu.pythonanywhere.com'+obj.url }).appendTo(li);

                    var span = $('<span/>', {
                        text: obj.gallery_id}).appendTo(li);

                    span.addClass('badge');

                //reverse the image order
                var list = $('#gallery');
                var listItems = list.children('li');
                list.append(listItems.get().reverse());

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

