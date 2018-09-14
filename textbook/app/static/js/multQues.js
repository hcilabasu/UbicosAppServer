 var logged_in=''
 var host_url = window.location.host

 $( function() {

    getAnswers();



  } ); //end of page load function

var getAnswers = function(){



    $('#page6-submit').click(function(e){


        var jsonObj = [];

        //capture the inputs by the user
        $.each([1,2,3,4,5], function(index, value){

            //console.log($("input[name='page6-input"+value+"']").val());
            var answer = $("input[name='page6-input"+value+"']").val();
            jsonObj.push(answer);

        });


        //console.log(jQuery.type(jsonObj)); //array of answers, convert to json
        jsonObj = JSON.stringify(jsonObj);
        //console.log(jQuery.type(jsonObj));
        //make an ajax call into database
         $.post({

               async: false,
               url:'/submitAnswer',
               data: {
                    'page': 6,
                    'answer': jsonObj
                    },
               success: function(response){

            }

            });


        //clear the input texts
        $.each([1,2,3,4,5], function(index, value){
            $("input[name='page6-input"+value+"']").val('');
        })

    });



}
