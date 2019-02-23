
$(function(){

    $('#ka-showAnsweredQues').hide();

    //ka_submit_button();
    copy_ka_text_button();

    //handle KA image upload
     $('#ka_img_upload').change(function(event){
         console.log('trying to upload photos')
         var form_data = new FormData($('#ka-upload-img-form')[0]);
         console.log('form_data', form_data);
         readURL_ka(this);
         //TODO: save the image in database
     })

    //handle textarea on focus out
    $('#KAAnswer').blur(function() {

            //TODO: add user log event; user log event will capture multiple attempts but model will store the latest answer
            //TODO: capture KA ID and pass it to the database

            var isRadioBtnChecked = $("input[name='ka-response-type']").prop('checked');
            //will return false if none of the radio button is not checked
            //will return true if one of the radio button is checked

            //if
            if(isRadioBtnChecked){
                 var user_response = $('#KAAnswer').val();
                //console.log('user response::',user_response)

                var ka_radio_input_type = $("input[name='ka-response-type']:checked").val();
                //console.log('ka-response-type', ka_radio_input_type);

                saveKAresponseToDB(2, ka_radio_input_type, user_response);

                //
                $('.ka-answer-p').text(user_response)

                //show the copy button since answer is posted
                $('#ka-showAnsweredQues').show();

            }else{
                alert("check radio button");
            }




        });

})


//handle file upload
var readURL_ka = function(input) {

        $('#ka-image').attr('src', '').hide();
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

//handle user answer submit
//var ka_submit_button = function(){
//    $('#ka-submit').click(function(e){
//        e.preventDefault();
//
//        console.log("user entered: ", $('#KAAnswer').val())
//        //TODO: save the answer in database
//        saveKAresponseToDB(1, $('#KAAnswer').val());
//
//        //hide one div and show the other
//        $('#ka-form-containter').hide();
//        $('#ka-showAnsweredQues').show();
//
//        //TODO: get the student response and set the answer to the p tag
//
//        $('.ka-answer-p').text($('#KAAnswer').val())
//   })
//}

//method to copy student answer using a button
var copy_ka_text_button = function(){
    $('.ka-row-copy-button').click(function(){
        //https://jqueryhouse.com/copy-data-to-clipboard-using-jquery/
        var copied_text = $(this).parent().siblings().text();
        console.log(copied_text);

        var value = '<input value="'+ copied_text +'" id="selVal" />';
        $(value).insertAfter($(this));
        $("#selVal").select(); //select works for input //https://stackoverflow.com/questions/50941892/copy-to-clipboard-value-of-selected-option
        document.execCommand("copy");
        $('div#ka-showAnsweredQues').find("#selVal").remove();

        alert("Copied the text: " + copied_text);

    })
}

var saveKAresponseToDB = function(id, response_type, answer_text){

        $.post({

               async: false,
               url:'/submitKAAnswer',
               data: {
                    'id': id,
                    'response_type': response_type,
                    'answer': answer_text
                    },
               success: function(response){

                    console.log(response)
            }

            });


            //send to user log as well
            //enterLogIntoDatabase('submit pressed', 'answer question' , value, current_pagenumber)
}


