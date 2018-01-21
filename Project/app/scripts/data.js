var tempChart = c3.generate({
    bindto: '#tempChart',
    data: {
        x: 'x', //bind the x axis to the 'x' data set
        columns: [
            ['x','2017-10-17', '2017-10-18', '2017-10-19', '2017-10-20', '2017-10-21', '2017-10-22', '2017-10-23', '2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
            ['temperature', 68, 68, 68, 68, 68, 68, 68, 59, 50, 44, 31]
        ]
    },
    axis: {
        x: {
            type: 'timeseries' // the x axis has a timeseries data type
        }
    }
})


var abvChart = c3.generate({
    bindto: '#abvChart',
    data: {
        x: 'x', //bind the x axis to the 'x' data set
        columns: [
            ['x','2017-10-17', '2017-10-18', '2017-10-19', '2017-10-20', '2017-10-21', '2017-10-22'],
            ['ABV', 1.2, 5.15, 6.33, 6.57, 6.7, 6.73]
        ]
    },
    axis: {
        x: {
            type: 'timeseries' // the x axis has a timeseries data type
        }
    }
})

var sgChart = c3.generate({
    bindto: '#sgChart',
    data: {
        x: 'x', //bind the x axis to the 'x' data set
        columns: [
            ['x','2017-10-17', '2017-10-18', '2017-10-19', '2017-10-20', '2017-10-21', '2017-10-22'],
            ['Specifc Gravity', 1.05579, 1.02571, 1.0172, 1.01572, 1.01498, 1.0148]
        ]
    },
    axis: {
        x: {
            type: 'timeseries' // the x axis has a timeseries data type
        },
        y: {
            tick: {
                format: d3.format('.3f') // the y axis should not display more than 2 decimal points
            }
        }
    }
})

var phChart = c3.generate({
    bindto: '#phChart',
    data: {
        x: 'x', //bind the x axis to the 'x' data set
        columns: [
            ['x','2017-10-17', '2017-10-18', '2017-10-19', '2017-10-20', '2017-10-21', '2017-10-22'],
            ['pH', 4.65, 4.13, 4.21, 4.3, 4.31, 4.3]
        ]
    },
    axis: {
        x: {
            type: 'timeseries' // the x axis has a timeseries data type
        },
        y: {
            tick: {
                format: d3.format('.2f') // the y axis should not display more than 2 decimal points
            }
        }
    }
})
