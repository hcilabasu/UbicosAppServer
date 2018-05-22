$(function(){

var ctx = $('#time-distance-chart');
var graph = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["1", "2", "3", "4", "5", "6"],
        datasets: [{
            label: "Time-Distance",
            data: [5, 10, 15, 20, 25, 30],
            fill: false,
            borderColor: '#07C',
        }]
    }
});


})