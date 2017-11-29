var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S'],
        datasets: [{
            data: [30, 200, 100, 400, 150, 250],
            backgroundColor: "rgb(0, 16, 142)"
        }, {
            data: [50, 20, 10, 40, 15, 25],
            backgroundColor: "rgb(255, 118, 0)"
        }]
    }
});
