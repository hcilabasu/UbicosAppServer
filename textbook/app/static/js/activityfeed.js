$(function(){

    var logged_user

    //initiate puhser with your application key
    var pusher = new Pusher('ea517de8755ddb1edd03',{
      cluster: 'us2',
      encrypted: true
    });

    //subscribe to the channel you want to listen to
    var my_channel = pusher.subscribe('a_channel');
    //wait for an event to be triggered in that channel
    my_channel.bind("an_event", function (data) {

        //  add in the thread itself
        var li = $("<li/>").appendTo(".feed");
        li.addClass('message self');

        var div = $("<div/>").appendTo(li);
        div.addClass('user-image');

        var span = $('<span/>', {
            text: data.name}).appendTo(div);

        var p = $('<p/>', {
                text: data.message}).appendTo(li);



    });


    //wait until the DOM is fully ready

    //add event listener to the chat button click
        $("#msg-send-btn").click(function(e){

        //stop page refreshing with click
            e.preventDefault();

        //get the user name who posted
            var user_name = $("input[name='username']").val()
            logged_user = user_name
            console.log(user_name);

        //get the currently typed message
            var message = $("input[name='msg-text']").val();
            console.log('user message :: '+message)


            $.post({
                url: '/ajax/chat/',
                data: {
                'username': user_name,
                'message': message
                },
                success: function (data) {

                    $('#btn-input').val('');

                }
            });

        })

})