 var logged_in=''
 var host_url = window.location.host

 $( function() {

    getAnswers();






  } ); //end of page load function

var isAnswerNull = 0;

var getAnswers = function(){

    $('#page7-submit').click(function(e){

        var jsonObj = [];

        //capture the inputs by the user
        $.each([1,2,3,4], function(index, value){

            //console.log($("input[name='page6-input"+value+"']").val());
            var answer = $("textarea[name='page7-input"+value+"']").val();
            console.log(answer)

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
        $.each([1,2,3,4], function(index, value){
            $("textarea[name='page7-input"+value+"']").val('');
        })

    });




    $('#page8-submit').click(function(e){
        var jsonObj = [];

        //capture the inputs by the user
        $.each([1,2,3,4], function(index, value){

            //console.log($("input[name='page6-input"+value+"']").val());
            var answer = $("textarea[name='page8-input"+value+"']").val();
            console.log(answer)

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
            $("textarea[name='page8-input"+value+"']").val('');
        })
    });


}
