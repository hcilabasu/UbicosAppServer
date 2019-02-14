
$(function(){

    $('#ka-showAnsweredQues').hide();

    ka_submit_button();
    copy_ka_text_button();

     $('#ka_img_upload').change(function(event){
         console.log('trying to upload photos')
         var form_data = new FormData($('#ka-upload-img-form')[0]);
         console.log('form_data', form_data);
         readURL_ka(this);
     })

})


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

var ka_submit_button = function(){
    $('#ka-submit').click(function(){

        $('#ka-form-containter').hide();
        $('#ka-showAnsweredQues').show();
   })
}

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

var readURL_ka = function(input) {

        console.log("here")
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


