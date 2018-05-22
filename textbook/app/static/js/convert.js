$(function(){

    //detect when value is entered in the text file
    $('#valueToBeConverted').on('input', function(e){


        var value = parseInt($('#valueToBeConverted').val(), 10);
        console.log('user input: ', value)

        //convertion details: http://www.kylesconverter.com/speed-or-velocity/inches-per-second-to-meters-per-second
        // 1 inch = .0254 meter
        var output = value * 0.0254 || 0

        $('#convertedValue').val(output)

    })

})

