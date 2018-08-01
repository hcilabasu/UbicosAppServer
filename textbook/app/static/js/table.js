var TABLE_DATASETS = {};

$(function(){

    $('#plot_table').click(function(){
        prepareDataset('table');
    });
    $('#plot_equation').click(function(){
        prepareDataset('equation');
    });

    var prepareDataset = function(type){
        var color = {
            table: '#007ACC',
            equation: 'rgb(250, 147, 28)'
        };
        var label = {
            table: 'Table',
            equation: 'Equation'
        };
        // Get values from table
        var getRow = function(rowClass){
            values = [];
            $("#TimeDistance ."+rowClass+" td").each(function(){
                val = parseFloat($(this).find(":text").val());
                values.push(val);
            });

            return values;
        }
        var y = getRow('distances'),
            x = getRow('times'),
            slope = parseFloat($('#slope').val()),
            points = [],
            n = x.length;
            var fakePoints = false;
            if (type == 'equation' && n == 1){
                // If this is equation and table hasn't been added yet / has only one point
                // In this case, create fake points
                n = 10;
                fakePoints = true;
            }
        for (let i = 0; i < n; i++) {
            // Create table points
            if (type == 'table'){
                points.push({
                    x: x[i],
                    y: y[i]
                });

            } else if (type == 'equation'){
                // Create equation points
                var xPoint = fakePoints ? i : x[i];
                points.push({
                    x: xPoint,
                    y: slope * xPoint
                });
            }
        }
        //converto to json and insert into database
        //console.log(points)
        TableDataInsert(type, points)
        // Only update targeted dataset
        TABLE_DATASETS[type] = {
            label: label[type],
            data: points,
            borderColor: color[type],
            backgroundColor: 'transparent',
            showLine: true,
            lineTension: 0
        };
        plotGraph();
    };

    $('#addColumn').click(function(){
        var MAX_COLUMNS = 6;
        var rows = $('#TimeDistance tr');
        // Check if there are already enough columns
        var length = $('td', $(rows[0])).length;
        if(length < MAX_COLUMNS){
            rows.each(function(i,d){
                $(d).append($('<td><input type="text" /></td>'));
            });
            if (length == MAX_COLUMNS - 1){
                // Hide button
                $('#addColumn').hide();
            }
        }
    });

    var plotGraph = function(){
        var datasets = [];
        if(TABLE_DATASETS['table']){
            datasets.push(TABLE_DATASETS['table']);
        }
        if(TABLE_DATASETS['equation']){
            datasets.push(TABLE_DATASETS['equation']);
        }
        var canvas = $('#time-distance-chart');
        canvas.fadeIn('fast');
        var graph = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Distance'
						}
					}]
                }
            }
        });
        graph.draw();
    };
    // Initialize graph
    plotGraph();

    var TableDataInsert = function(type, points){

        var pointsAsJSON = JSON.stringify(points);
        console.log(pointsAsJSON)
        //send to database

          $.post({

           async: false,
           url:'/tableData/save/', //save table data
           data: {
                'table_id': 1, //TODO: pass values
                'plot_type': type ,
                'plot_data': pointsAsJSON
                },
           success: function(response){

        }

        });
    }
})