
$(function(){


    //loadtable();
    //loadGraph();
    detectTableClick();


})

var loadtable = function (activity_id){

    var $tableBody = $('#tbody'); // use a Id selector here
    var rowHTML = '';

    dataFromServer = getGalleryInfo(activity_id); //ajax method call
    console.log(dataFromServer)
    console.log(dataFromServer.length)
    var row_cells = dataFromServer[0]; //list of users
    var row_length = dataFromServer[0].length-3; //row length = student number; -3 removing teacher users
    var col_length = dataFromServer.length - 1; //removing the user entry

    console.log(row_length);


    for (var i = 0; i < row_length; i++) {
      let row = $('<tr></tr>');
      row.append('<td>'+row_cells[i]+'</td>');
      for (col = 1; col <= col_length; col++) {
        row.append('<td></td>');
      }
      //console.log(row)
      $tableBody.append(row);
    }

    $('#teacher-gallery-table').append($tableBody);

//     rowHTML = '';
//     rowHTML += '<td width=30%><a>Image Id</a></td>';
//     rowHTML += '<td width=70%><a>Posted By</a></td>';
//     rowHTML += '<td width=30%><a> Total Comments</a></td>';
//     $tableBody.append('<tr>' + rowHTML + '</tr>');
//
//    $.each(dataFromServer, function(key, value){
//
//         rowHTML = '';
//         rowHTML += '<td width=30%><a data-index=' + value.image_id + '>' + value.image_id + '</a></td>';
//         rowHTML += '<td width=70%><a class="cc" data-index=' + value.posted_by + '>' + value.posted_by + '</a></td>';
//         rowHTML += '<td width=30%><a class="cc" data-index=' + value.posted_by + '>' + value.comments + '</a></td>';
//         $tableBody.append('<tr>' + rowHTML + '</tr>');
//
//    })
//
//    $('#teacher-gallery-table').append($tableBody);

}

var getGalleryInfo = function(activity_id){

    var returnValue = null;
    $.ajax({
            type:'GET',
            url:'http://'+ host_url +'/getGalleryTableTD/'+activity_id,
            async: false, //wait for ajax call to finish, else logged_in is null in the following if condition
            success: function(e){
                returnValue = e.success;
                //console.log('logged in username (inside) :: ', logged_in)
            }
        })

    return returnValue;

}

var displayImage = function(imageObj){

}

var loadGraph = function(){

//    var line1 = [["10.01.2011",3.9990],["11.01.2011",3.9910],["12.01.2011",4.0140],["13.01.2011",3.9940],["14.01.2011",3.9050],["17.01.2011",3.9340],["18.01.2011",3.9520],["19.01.2011",3.8980],["20.01.2011",3.8690],["21.01.2011",3.8830],["24.01.2011",3.8550],["25.01.2011",3.8480],["26.01.2011",3.8190],["27.01.2011",3.8440],["28.01.2011",3.8260],["31.01.2011",3.8060],["01.02.2011",3.7970],["02.02.2011",3.8060],["03.02.2011",3.8110],["04.02.2011",3.8640],["07.02.2011",3.8750],["08.02.2011",3.8640],["09.02.2011",3.8480],["11.02.2011",3.8570],["14.02.2011",3.8880],["15.02.2011",3.88],["16.02.2011",3.8520],["17.02.2011",3.8590],["18.02.2011",3.8690],["22.02.2011",3.8440],["23.02.2011",3.8080],["24.02.2011",3.7410],["25.02.2011",3.7460],["28.02.2011",3.7550],["01.03.2011",3.7520],["02.03.2011",3.76],["03.03.2011",3.7420],["04.03.2011",3.7430],["07.03.2011",3.7330],["08.03.2011",3.7260],["09.03.2011",3.76],["10.03.2011",3.7910],["11.03.2011",3.79]];
//    var plot1 = $.jqplot('teacher-student-plot', [line1], {
//        title: 'User Participation Bar Chart',
//        axes: { xaxis: { renderer: $.jqplot.DateAxisRenderer } },
//        series: [{ lineWidth: 4, markerOptions: { style: 'square' } }]
//    });

    var line1 = [['ant', 4],['fox', 6],['penguin', 2],['bat', 5],['panda', 6]];

    $('#teacher-student-plot').jqplot([line1], {
        title:'User Participation',
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                // Set the varyBarColor option to true to use different colors for each bar.
                // The default series colors are used.
                varyBarColor: true
            }
        },
        axes:{
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer
            }
        }
    });


}

var detectTableClick = function(){

        //detect when username in the table is clicked
        //https://stackoverflow.com/questions/1359018/in-jquery-how-to-attach-events-to-dynamic-html-elements
        $('body').on('click', 'a.cc', function() {
            // get the username who link was clicked
            var username = $(this).text();

        });
}



