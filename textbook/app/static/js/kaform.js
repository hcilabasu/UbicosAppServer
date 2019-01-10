



$(function(){

    $('#ka-showAnsweredQues').hide();

    ka_submit_button();
    copy_ka_text_button();

})


var ka_submit_button = function(){
    $('#ka-submit').click(function(){

        $('#ka-form-containter').hide();
        $('#ka-showAnsweredQues').show();
   })
}

var copy_ka_text_button = function(){
    $('.ka-row-copy-button').click(function(){
        //https://jqueryhouse.com/copy-data-to-clipboard-using-jquery/
        var copied_text = $(this).parent().siblings().select();
        console.log(copied_text);
        document.execCommand("copy");
        alert("Copied the text: " + copied_text.text());
    })
}
