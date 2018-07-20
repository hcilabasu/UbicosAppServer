$( function() {


  } );

var enterLogIntoDatabase = function(action, type, input, pagenumber){


    //make an ajax call into database
     $.post({

           async: false,
           url:'/userlog',
           data: {
                'action': action,
                'type': type,
                'input': input,
                'pagenumber': pagenumber
                },
           success: function(response){

        }

        });


}