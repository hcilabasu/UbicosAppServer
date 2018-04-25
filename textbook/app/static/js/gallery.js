
    function showGallery(){

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

      

    //   var img_src
    //   $.ajax({
    //   type: 'GET',
    //   dataType: 'json',
    //   url: 'http://hcilabasu.pythonanywhere.com/getImage/',
    //   success: function (data, textStatus, xhr) {
    //             console.log('success:',data.success);
    //             img_src=data.success
    //             console.log(img_src)
    //             document.getElementById("gallery1").style.display = "inline";
    //             document.getElementById("gallery1").src='http://hcilabasu.pythonanywhere.com'+img_src
    //
    //     },
    //     error: function (error, textStatus) {
    //               console.log('error:', error.statusText);
    //     }
    //
    // }); //end of ajax call


      // var display = document.getElementById("gallery1").style.display;
      //
      // if(display == 'none'){
      //   document.getElementById("gallery1").style.display = "inline";
      //   document.getElementById("bigimages").style.display = "block";
      // }
      // else{
      //   document.getElementById("gallery1").style.display = "none";
      //   document.getElementById("bigimages").style.display = "none";
      // }
    }

    function changeImage(current) {
      var imagesNumber = 5;

      for (i=1; i<=imagesNumber; i++) {
        if (i == current) {
          document.getElementById("normal" + current).style.display = "block";
        } else {
          document.getElementById("normal" + i).style.display = "none";
        }
      }
    }
