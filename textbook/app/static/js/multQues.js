 var logged_in=''
 var host_url = window.location.host

 $( function() {

    getAnswers();

    $('#page4-submit1').click(function(e){
         var answer = $("textarea[name='page4-input1']").val();
         console.log(answer);
    });





  } ); //end of page load function

var isAnswerNull = 0;

var getAnswers = function(){

    $('#page7-submit').click(function(e){


        var jsonObj = [];


        //capture the inputs by the user
        $.each([1,2,3,4,5], function(index, value){

            //console.log($("input[name='page6-input"+value+"']").val());
            var answer = $("textarea[name='page7-input"+value+"']").val();

            //handle empty input
            if(!answer){
                console.log('answer is empty')
                isAnswerNull = 1;
            }

            jsonObj.push(answer);

        });


        //console.log(jQuery.type(jsonObj)); //array of answers, convert to json
        jsonObj = JSON.stringify(jsonObj);
        //console.log(jQuery.type(jsonObj));

        //make an ajax call into database
        console.log('isAnswerNull value :: ', isAnswerNull)
        if(isAnswerNull == 1){

            console.log('one of the inputs is empty');
            alert('one of the inputs is empty');

        }else{
               $.post({

               async: false,
               url:'/submitAnswer',
               data: {
                    'page': 6,
                    'answer': jsonObj
                    },
               success: function(response){
                    //TODO: better success message
                    alert('your response is submitted');
            }

            });
        }


        //clear the input texts
        $.each([1,2,3,4,5], function(index, value){
            $("textarea[name='page6-input"+value+"']").val('');
        })

    });



     $('#page4-submit2').click(function(e){
         var answer = $("textarea[name='page4-input2']").val();
         console.log(answer);
    });


    $('#page8-submit').click(function(e){
        console.log("page 8")
    });


}
