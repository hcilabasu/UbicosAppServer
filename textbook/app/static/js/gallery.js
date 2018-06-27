    var host_url = window.location.host

    $(function(){

        $("#file-upload").change(function(event){

                console.log("file changed");

                //get file information
                var form_data = new FormData($('#upload-img')[0]);
                //console.log('form_data', form_data)

                var img_data //variable to store the image

                //ajax call to post the uploaded image in the database and with successful entry show the image at the beginning of the list
                $.ajax({
                      type:'POST',
                      url:'http://'+ host_url +'/uploadImage/',
                      processData: false,
                      contentType: false,
                      async: false,
                      cache: false,
                      data : form_data,
                      success: function(response){

                        //TODO: update user with a 'success' message on the screen

                        img_data = response.success;
                        var obj = jQuery.parseJSON(img_data);
                        //console.log(obj)
                        //console.log("appending image to the gallery")

                        var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

                        var img = $('<img/>', {
                                src : 'http://'+ host_url +obj.url }).appendTo(li);

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

            //back button
            $(".previous-image").click(function(e){
                e.preventDefault();
                var val = $('input[name=image-index]').val() - 1
                $('.section input[name="image-index"]').attr('value', val)
                console.log('previous image index:: ', val)
                var prev_img = $('#gallery li').eq(val).children('img')[0]
                console.log($(prev_img))
                openImageView($('#gallery-panel'), $(prev_img));

            })

            //next button
            $(".next-image").click(function(e){
                e.preventDefault();
                var val = eval($('input[name=image-index]').val()) + 1
                $('.section input[name="image-index"]').attr('value', val)
                console.log('previous image index:: ', val)
                var prev_img = $('#gallery li').eq(val).children('img')[0]
                console.log($(prev_img))
                openImageView($('#gallery-panel'), $(prev_img));

            })

            //back to gallery from single image view
            $("#backToGallery").click(function(e){
                e.preventDefault();
                $("#single-image-view").hide()
                $("#gallery-panel").show()
            })
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

        //function called from digTextBook.js
        function viewDiv(view){

            //console.log('value pass to gallery.js', view)
            if(view == 'class'){

                $('#upload-img input[name="group-id"]').attr('value', 0)
                $('.card.gallery #gallery-group-heading').text('All Submission'); //update the sub-title of gallery page

                displayGallery(0)

            }else{

                //TODO: check if 'group' was selected before

                //console.log('group value stored??', groupValue)

                $('.card.active').removeClass('active');
                $('.card.group').addClass('active');

                //get group id from the radio button
                var groupValue
                $("input[name='group']").change(function(){
                    groupValue = $("input[name='group']:checked").val();
                    if(groupValue){
                            //pass group value in the form so it can be added into the database
                            $('#upload-img input[name="group-id"]').attr('value', groupValue)
                            console.log('group ID :: ', groupValue)
                            $('.card.group').removeClass('active');
                            $('.card.gallery').addClass('active');
                            $('.card.gallery #gallery-group-heading').text('Group #'+groupValue+' Submission'); //update the sub-title of gallery page

                    }
                     displayGallery(groupValue)
                })
            }
        }

        var openImageView = function(galleryView, image){

        //console.log('openImageView', galleryView)
        var singleImageViewer = $('#single-image-view');

        // Toggle views: Display or hide the matched elements.
        $('.gallery-panel', galleryView).toggle();

        // Get image element and add it to the DOM
        var image = image.clone();

        //remove previous single image before adding new one
        $('.section').children('img').remove();

        $('.section', singleImageViewer).append(image);
        //console.log($('#single-image-view').html())

    };

      function displayGallery(groupValue){

            $.ajax({

               type:'GET',
               url:'http://'+ host_url +'/getImage/'+groupValue, //get all the image for the particular group
               success: function(response){

               //TODO: update user with a 'success' message on the screen

               img_data = response.success;
               var obj = jQuery.parseJSON(img_data);
               $('#gallery').empty();
               //console.log('gallery - length: ', $("#gallery li").length)
               $.each(obj, function(key,value) {

                   //console.log(value.fields) //gives all the value
                   //console.log(value.fields['image']); //image field in the model
                   // console.log("building gallery from scratch")
                   console.log('total number of images: ', obj.length)

                   var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

                   var img = $('<img/>', {
                       src : 'http://'+ host_url +'/media/'+value.fields['image'] }).appendTo(li);


                       // Add clickhandler to open the single image view
                       img.on('click', function(event){
                           console.log($(this))
                           //console.log($(this).parent().siblings().length); //+1 gives me the total number of images in the gallery
                           console.log($(this).parent().index())
                           $('.section input[name="image-index"]').attr('value', $(this).parent().index())
                           openImageView($('#gallery-view'), $(this));

                       });

                });

                //reverse the image order
                var list = $('#gallery');
                var listItems = list.children('li');
                list.append(listItems.get().reverse());

            }

        });

    }

