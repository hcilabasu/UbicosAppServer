$(function(){

    $("#msg-send-btn").click(function(e){

        //stop page refreshing with click
        e.preventDefault();

        //capture the message that was enterted
        var msg_sent = $("input[name='msg-text']").val();
        console.log(msg_sent);

        //clear the message from the box
        $("input[name='msg-text']").val('');

        //TODO: make the feed scrollable; fixed. added overflow:auto in css

        //TODO; fix the position of the input box

        //TODO: add in the database

        //add in the thread itself
        var li = $("<li/>").appendTo(".feed");
        li.addClass('message self');

        var div = $("<div/>").appendTo(li);
        div.addClass('user-image');

        //TODO: use the logged in username
        var span = $('<span/>', {
            text: 'izzy'}).appendTo(div);

        var p = $('<p/>', {
                text: msg_sent}).appendTo(li);




    });
})