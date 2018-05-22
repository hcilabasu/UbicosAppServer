
	var host_url = window.location.host


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
				  processData: false,
				  contentType: false,
				  async: false,
				  cache: false,
				  data : form_data,
				  success: function(response){

					//TODO: update user with a 'success' message on the screen

					img_data = response.success;

					var obj = jQuery.parseJSON(img_data);

					console.log(obj)

					    console.log("appending image to the gallery")


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

	function viewDiv(view){

		console.log('value pass to gallery.js', view)
		if(view == 'class'){

			$('.group-view').hide()
			$('#upload-img input[name="group-id"]').attr('value', 0)
			$('.card.gallery #gallery-group-heading').text('All Submission'); //update the sub-title of gallery page

			displayGallery(0)

		}else{

            //TODO: check if 'group' was selected before

			console.log('group value stored??', groupValue)

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

  function displayGallery(groupValue){

		$.ajax({



		   type:'GET',
		   url:'http://'+ host_url +'/getImage/'+groupValue,
		   success: function(response){

		   //TODO: update user with a 'success' message on the screen

		   //console.log('success:', response.success);
		   img_data = response.success;

		   var obj = jQuery.parseJSON(img_data);

		   $('#gallery').empty()

		   console.log('gallery - length: ', $("#gallery li").length)



			   $.each(obj, function(key,value) {

			   //console.log(value.fields) //gives all the value
			   //console.log(value.fields['image']); //image field in the model

			   console.log("building gallery from scratch")

			    var li = $("<li/>").appendTo("#gallery"); //<ul id=gallery>

				var img = $('<img/>', {

					src : 'http://'+ host_url +'/media/'+value.fields['image'] }).appendTo(li);
					//src : 'http://hcilabasu.pythonanywhere.com/media/'+value.fields['image'] }).appendTo(li);

					var span = $('<span/>', {
						text: value.fields['gallery_id']}).appendTo(li);

					span.addClass('badge');

					// Add clickhandler to open the single image view
					// IMPORTANT: this (along with the function is uses) should be moved to gallery.js

					img.on('click', function(){

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

