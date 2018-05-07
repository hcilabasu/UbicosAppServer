$(function(){

    $("#msg-send-btn").click(function(e){

        //stop page refreshing with click
        e.preventDefault();

        //capture the message that was enterted
        var msg_sent = $("input[name='msg-text']").val();
        console.log(msg_sent);

        //get the user name who posted
        var user_name = $("input[name='username']").val()
        console.log(user_name);

        //clear the message from the box
        $("input[name='msg-text']").val('');

        //TODO; fix the position of the input box. added position:sticky in css

        //TODO: show newer message without scrolling the feed

        //TODO: add in the database, make an ajax call

        //add in the thread itself
        var li = $("<li/>").appendTo(".feed");
        li.addClass('message self');

        var div = $("<div/>").appendTo(li);
        div.addClass('user-image');

        var span = $('<span/>', {
            text: user_name}).appendTo(div);

        var p = $('<p/>', {
                text: msg_sent}).appendTo(li);




    });
})