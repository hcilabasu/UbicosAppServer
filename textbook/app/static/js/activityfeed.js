$(function(){

    var host_url = window.location.host
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
            url:'http://'+ host_url +'/getUsername/',
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                logged_in  = e.name
                //console.log('logged in username (inside) :: ', logged_in)
            }
        })

        //  add in the thread itself
        var li = $("<li/>").appendTo("#activity-feed");

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
        $('#dynamic-content').animate({ scrollTop: $('#activity-feed').height() }, 400);

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

            if(message == ""){
                console.log('empty input activity feed')
                enterLogIntoDatabase('click', 'activity-feed empty message input' , message, current_pagenumber)
            }else{

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

            }



        })

})

function loadFeed(){
    $.ajax({

            type:'GET',
            url:'http://'+ host_url +'/updateFeed/',

            success: function(response){

                var logged_in_user = response.username //passed from views.py - updateFeed

                msg_data = response.success
                var obj = jQuery.parseJSON(msg_data);

                //console.log(obj)

                $.each(obj, function(key, value){

                    //  add in the thread itself
                    var li = $("<li/>").appendTo("#activity-feed");
                    if(value.fields['posted_by'][0] == logged_in_user){
                        li.addClass('message self');
                    }else{
                        li.addClass('message');
                    }

                    var div = $("<div/>").appendTo(li);
                    div.addClass('user-image');

                    var span = $('<span/>', {
                        text: value.fields['posted_by'][0]}).appendTo(div);

                    var p = $('<p/>', {
                            text: value.fields['content']}).appendTo(li);
                });

                // Scroll page to bottom
                $('#dynamic-content').animate({ scrollTop: $('#activity-feed').height() }, 400);
            }
        });
}