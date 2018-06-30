$(function(){

    $('#plot_btn').click(function(e){
        // Get values from table
        var getRow = function(rowClass){
            values = [];
            $("#TimeDistance ."+rowClass+" td").each(function(){
                val = parseFloat($(this).find(":text").val());
                values.push(val);
            });
            return values;
        }
        var distances = getRow('distances'),
            times = getRow('times'),
            slope = parseFloat($('#slope').val()),
            tablePoints = [],
            equationPoints = [];
        for (let i = 0; i < distances.length; i++) {
            // Create table points
            tablePoints.push({
                x: times[i],
                y: distances[i]
            });
            // Create equation points
            equationPoints.push({
                x: times[i],
                y: slope * times[i]
            })
        }
        // Plot
        var canvas = $('#time-distance-chart');
        canvas.fadeIn('fast');
        var graph = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Table',
                    data: tablePoints,
                    borderColor: '#007ACC',
                    backgroundColor: 'transparent',
                    showLine: true,
                    lineTension: 0
                },{
                    label: 'Equation',
                    data: equationPoints,
                    borderColor: 'rgb(250, 147, 28)',
                    backgroundColor: 'transparent',
                    showLine: true
                }]
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
    });

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
})