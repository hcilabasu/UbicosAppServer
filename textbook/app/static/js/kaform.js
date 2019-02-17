
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

            console.log("user entered: ", $('#KAAnswer').val())
            //TODO: save the answer in database
            saveKAresponseToDB(1, $('#KAAnswer').val());

            //hide one div and show the other
            $('#ka-form-containter').hide();
            $('#ka-showAnsweredQues').show();

            //TODO: get the student response and set the answer to the p tag

            $('.ka-answer-p').text($('#KAAnswer').val())
        });

})


//handle file upload
var readURL_ka = function(input) {

        $('#blah').attr('src', '').hide();
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

var saveKAresponseToDB = function(id, answer_text){

        $.post({

               async: false,
               url:'/submitKAAnswer',
               data: {
                    'id': id,
                    'answer': answer_text
                    },
               success: function(response){

                    console.log(response)
            }

            });


            //send to user log as well
            //enterLogIntoDatabase('submit pressed', 'answer question' , value, current_pagenumber)
}


