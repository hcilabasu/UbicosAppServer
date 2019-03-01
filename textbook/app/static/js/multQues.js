 var logged_in=''
 var host_url = window.location.host

 $( function() {

    getAnswers();

  } ); //end of page load function

var isAnswerNull = 0;

var getAnswers = function(){

    //handling persistence - start
    if(localStorage.getItem("page5input1")){

        $('#page5-input1').attr('disabled',true);
        $("textarea[name='page5-input1']").val(localStorage.getItem("page5input1"))

    }

    if(localStorage.getItem("page7input1")){
        answer = JSON.parse(localStorage.getItem("page7input1"))
        //console.log(JSON.parse(localStorage.getItem("page7input1")));

        //$('#page7-input1').attr('disabled',true);

        $("textarea[name='page7-input1']").val(answer[0].answer)
        $("textarea[name='page7-input2']").val(answer[1].answer)
        $("textarea[name='page7-input3']").val(answer[1].answer)

    }

    if(localStorage.getItem("page7input2")){
        answer = JSON.parse(localStorage.getItem("page7input2"))

        $('#page7-input2').attr('disabled',true);
        $("textarea[name='page7-input4']").val(answer[0].answer)
        $("textarea[name='page7-input5']").val(answer[1].answer)

    }

    if(localStorage.getItem("page12input1")){
        answer = JSON.parse(localStorage.getItem("page10input1"))

        $('#page10-input1').attr('disabled',true);
        $("textarea[name='page10-input1']").val(answer[0].answer)
        $("textarea[name='page10-input2']").val(answer[1].answer)
        $("textarea[name='page10-input3']").val(answer[1].answer)

    }


     //handling persistence - end

    //page 5 input
    $("#page5-input1").off().click(function(e){

        //get the answer from the textbox
        var answer = $("textarea[name='page5-input1']").val();
        //console.log("page5-input1", answer);

        //send to user lof db

        //send to database if the answer is not null
        if(!answer.trim()){

             showErrorMsg();

        }else{

                 //send to db and disable the submit button
                localStorage.setItem("page5input1", answer);
                sendUserInputToDB(5, answer);
                //$('#page5-input1').attr('disabled',true);
        }


    })





    //page 7 input1
    $("#page7-input1").off().click(function(e){

        //multiple inputs instead of 1, store them in the array
        var answerArray = [];

        //variable used to see if any of the input is empty or not
        var isAnswerNull = 0;

        //get the answer from the textbox
        $.each([1,2,3], function(index, value){

            var answer = $("textarea[name='page7-input"+value+"']").val();

            //handle empty input
            if(!answer.trim()){

                isAnswerNull = 1;

            }else{
                //add question so its easier to understand which answer refers to which question
                var temp = {
                    question: 'page7-input'+value,
                    answer: answer.trim()
                }

                answerArray.push(temp);
            }

        });

        //array of answers, convert to json
        answerJson = JSON.stringify(answerArray);

        //send to user lof db

        //send to database if the answer is not null
        if(isAnswerNull == 1){

            showErrorMsg();

            isAnswerNull = 0;

        }else{

            //send to db and disable the submit button
            sendUserInputToDB(7, answerJson);
            localStorage.setItem("page7input1", answerJson);
            //$('#page7-input1').attr('disabled',true);

        }

    })

     //page 7 input2
    $("#page7-input2").off().click(function(e){

        //multiple inputs instead of 1, store them in the array
        var answerArray = [];

        //variable used to see if any of the input is empty or not
        var isAnswerNull = 0;

        //get the answer from the textbox
        $.each([4,5], function(index, value){

            var answer = $("textarea[name='page7-input"+value+"']").val();

            //handle empty input
            if(!answer.trim()){

                isAnswerNull = 1;

            }else{

                //add question so its easier to understand which answer refers to which question
                var temp = {
                    question: 'page7-input'+value,
                    answer: answer.trim()
                }

                answerArray.push(temp);
            }

        });

        //array of answers, convert to json
        answerJson = JSON.stringify(answerArray);

        //send to user lof db

        //send to database if the answer is not null
        if(isAnswerNull == 1){

            showErrorMsg();

            isAnswerNull = 0;

        }else{

            //send to db and disable the submit button
            sendUserInputToDB(7, answerJson);
            localStorage.setItem("page7input2", answerJson);
            //$('#page7-input2').attr('disabled',true);

        }

    })

    //page 12 input1
    $("#page12-input1").off().click(function(e){

        //multiple inputs instead of 1, store them in the array
        var answerArray = [];

        //variable used to see if any of the input is empty or not
        var isAnswerNull = 0;

        //get the answer from the textbox
        $.each([1,2,3], function(index, value){

            var answer = $("textarea[name='page12-input"+value+"']").val();

            //handle empty input
            if(!answer.trim()){

                isAnswerNull = 1;

            }else{
                var temp = {
                    question: 'page12-input'+value,
                    answer: answer.trim()
                }
                answerArray.push(temp);
            }

        });

        //array of answers, convert to json
        answerJson = JSON.stringify(answerArray);

        //send to user lof db

        //send to database if the answer is not null
        if(isAnswerNull == 1){

            showErrorMsg();

            isAnswerNull = 0;

        }else{

            //send to db and disable the submit button
            sendUserInputToDB(12, answerJson);
            localStorage.setItem("page12input1", answerJson);
            //$('#page10-input1').attr('disabled',true);

        }

    })



}

var sendUserInputToDB = function(page, value){


        $.post({


               async: false,
               url:'/submitAnswer',
               data: {
                    'page': page,
                    'answer': value
                    },
               success: function(response){

                    $("#myModal").css({ display: "block" });
                    $("#myModal h2").text("Your response was recorded");

                    $(".modal-close").click(function(e){
                         $("#myModal").css({ display: "none" });
                    });
            }

            });


            //send to user log as well
            enterLogIntoDatabase('submit pressed', 'answer question' , value, current_pagenumber)
}

var showErrorMsg = function(){

     modal = $("#myModal")

     $("#myModal").css({ display: "block" });
     $("#myModal h2").text("You’re missing one or more answers.");

     $(".modal-close").click(function(e){
         $("#myModal").css({ display: "none" });
     });

}