
$(function(){


    //loadtable();


})

var loadtable = function (activity_id){

    var $tableBody = $('#tbody'); // use a Id selector here
    var rowHTML = '';

    dataFromServer = getGalleryInfo(activity_id);
    alert(jQuery.parseJSON(dataFromServer));

    for (var i = 1; i <= 15; i++) {
      rowHTML += '<td><a data-index=' + i + '>' + i + '</a></td>';

      if (i % 5 == 0) {
        $tableBody.append('<tr>' + rowHTML + '</tr>');
        rowHTML = '';
      }
    }

    $('#teacher-gallery-table').append($tableBody);

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

