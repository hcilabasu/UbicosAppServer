 var logged_in=''
 var host_url = window.location.host

 $( function() {

    getAnswers();






  } ); //end of page load function

var isAnswerNull = 0;

var getAnswers = function(){

    $('#page7-submit').off().click(function(e){

     $(this).css('background-color', '#A0A0A0'); //change the border to show that button is clicked.
     $(this).css('outline', 'none');

     var jsonObj = [];

     //capture the inputs by the user
      $.each([1,2,3,4], function(index, value){

        //console.log($("input[name='page6-input"+value+"']").val());
        var answer = $("textarea[name='page7-input"+value+"']").val();
        console.log(answer)

        //handle empty input
        if(!answer.trim()){
            console.log('answer is empty')
            isAnswerNull = 1;

        }

        jsonObj.push(answer.trim());

    });


    //console.log(jQuery.type(jsonObj)); //array of answers, convert to json
    jsonObj = JSON.stringify(jsonObj);
    //console.log(jQuery.type(jsonObj));

    //make an ajax call into database
    console.log('isAnswerNull value :: ', isAnswerNull)
    if(isAnswerNull == 1){

        modal = $("#myModal")
        console.log(modal)

        $("#myModal").css({ display: "block" });
        $("#myModal h2").text("one of the inputs is empty");

        $(".modal-close").click(function(e){
             $("#myModal").css({ display: "none" });
        });

        isAnswerNull = 0;


    }else{
           $.post({

           async: false,
           url:'/submitAnswer',
           data: {
                'page': 6,
                'answer': jsonObj
                },
           success: function(response){

                //open success modal here.
            modal = $("#myModal")
            console.log(modal)

            $("#myModal").css({ display: "block" });
            $("#myModal h2").text("Your response was recorded");

            $(".modal-close").click(function(e){
                 $("#myModal").css({ display: "none" });
            });


        }

        });
    }

    //clear the input texts
    $.each([1,2,3,4], function(index, value){
        $("textarea[name='page7-input"+value+"']").val('');
    })

});




    $('#page8-submit').off().click(function(e){

        $(this).css('background-color', '#A0A0A0'); //change the border to show that button is clicked.
        $(this).css('outline', 'none');

        var jsonObj = [];

        //capture the inputs by the user
        $.each([1,2,3,4], function(index, value){

            //console.log($("input[name='page6-input"+value+"']").val());
            var answer = $("textarea[name='page8-input"+value+"']").val();
            console.log(answer)

            //handle empty input
            if(!answer.trim()){
                console.log('answer is empty')
                isAnswerNull = 1;

            }

            jsonObj.push(answer.trim());

        });


        //console.log(jQuery.type(jsonObj)); //array of answers, convert to json
        jsonObj = JSON.stringify(jsonObj);
        //console.log(jQuery.type(jsonObj));

        //make an ajax call into database
        console.log('isAnswerNull value :: ', isAnswerNull)
        if(isAnswerNull == 1){

            $("#myModal").css({ display: "block" });
            $("#myModal h2").text("one of the inputs is empty");

            $(".modal-close").click(function(e){
                 $("#myModal").css({ display: "none" });
            });

            isAnswerNull = 0;


        }else{
               $.post({

               async: false,
               url:'/submitAnswer',
               data: {
                    'page': 6,
                    'answer': jsonObj
                    },
               success: function(response){

                    $("#myModal").css({ display: "block" });
                    $("#myModal h2").text("Your response was recorded");

                    $(".modal-close").click(function(e){
                         $("#myModal").css({ display: "none" });
                    });
            }

            });
        }


        //clear the input texts
        $.each([1,2,3,4,5], function(index, value){
            $("textarea[name='page8-input"+value+"']").val('');
        })
    });


}
