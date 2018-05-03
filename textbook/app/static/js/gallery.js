
    function showGallery(gallery){

      document.getElementById("right_header").innerHTML="Gallery";

      var display = document.getElementById("galleryID").style.display;

      if(display == 'none'){
        document.getElementById("galleryID").style.display = "inline";
        document.getElementById("right_header").style.display = "inline";
      }
      else{
        document.getElementById("galleryID").style.display = "none";
        document.getElementById("right_header").style.display = "none";

      }

      var gallery_id = gallery.getAttribute("data-gallery-id");
      console.log(gallery_id)

      var img_number = document.getElementById("img_number")
      img_number.innerHTML = gallery_id

      

       var img_src
       $.ajax({
       type: 'GET',
       dataType: 'json',
       //url: 'http://hcilabasu.pythonanywhere.com/getImage/',
       url: 'http://127.0.0.1:8000/getImage/',
       success: function (data, textStatus, xhr) {
                 console.log('success:',data.success);
                 img_src=data.success
                 console.log(img_src)
                 document.getElementById("gallery1").style.display = "inline";
                 //document.getElementById("gallery1").src='http://hcilabasu.pythonanywhere.com'+img_src
                 document.getElementById("gallery1").src='http://127.0.0.1:8000'+img_src

         },
         error: function (error, textStatus) {
                   console.log('error:', error.statusText);
         }

     }); //end of ajax call

 //preview image before it is uploaded in the server
    $("#file-upload").change(function(){
        readURL(this);
    });

    }


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#default').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

