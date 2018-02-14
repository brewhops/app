<template>
  <div id="sgChart"></div>
</template>

<script>
// import the c3 javascript code
const c3 = require('c3')
// import the c3 css code
// if you dont specify a starting location, webpack will look in the node_modules folder
import 'c3/c3.min.css'

export
default {
  name: 'sg-chart',
  data() {
    return {};
  },
  mounted: function() {
    c3.generate({
      bindto: this.$el,
      data: {
        x: 'x', //bind the x axis to the 'x' data set
        columns: [
          ['x', '2017-10-17', '2017-10-18', '2017-10-19', '2017-10-20', '2017-10-21', '2017-10-22'],
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
    });
  }
};
</script>

<style lang="css" scoped>
</style>
