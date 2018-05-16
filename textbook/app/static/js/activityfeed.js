$(function(){


    //initiate puhser with your application key
    var pusher = new Pusher('ea517de8755ddb1edd03',{
      cluster: 'us2',
      encrypted: true
    });

    //subscribe to the channel you want to listen to
    var my_channel = pusher.subscribe('a_channel');

    //wait for an event to be triggered in that channel
    my_channel.bind("an_event", function (data) {

        var logged_in = ''

        //get the logged in user
        $.ajax({
            type:'GET',
            url:'http://127.0.0.1:8000/getUsername/',
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                logged_in  = e.name
                //console.log('logged in username (inside) :: ', logged_in)
            }
        })

        //  add in the thread itself
        var li = $("<li/>").appendTo(".feed");

        console.log ('message posted by', data.name)
        console.log('logged in username (outside):: ', logged_in)
        if(logged_in == data.name){
               li.addClass('message self');
        }else{
               li.addClass('message');
        }

        var div = $("<div/>").appendTo(li);
        div.addClass('user-image');

        var span = $('<span/>', {
            text: data.name}).appendTo(div);

        var p = $('<p/>', {
                text: data.message}).appendTo(li);

        // Scroll view
        $('#dynamic-content').animate({ scrollTop: $('.feed').height() }, 400);

    });


    //add event listener to the chat button click
    $("#msg-send-btn").click(function(e){

        //stop page refreshing with click
            e.preventDefault();

        //get the user name who posted
            var user_name = $("input[name='username']").val()
            console.log(user_name);

        //get the currently typed message
            var message = $("input[name='msg-text']").val();
            console.log('user message :: '+message)

           //triggers the event in views.py
            $.post({
                url: '/ajax/chat/',
                data: {
                'username': user_name,
                'message': message
                },
                success: function (data) {

                    //empty the message pane
                    $('#msg-text').val('');

                    //console.log(data)

                }
            });

        })

})