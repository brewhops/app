<template>
</template>

<script>
// import the c3 javascript code
const c3 = require('c3')
// import the c3 css code
// if you dont specify a starting location, webpack will look in the node_modules folder
import 'c3/c3.min.css'

export default {
  name: 'chart',
  props: ['date', 'data'],
  data() {
    return {};
  },
  watch: {
    // when the data array changes, redraw the chart
    data: function() {
      // create our chart
      c3.generate({
        // bind it to this instance of the component
        bindto: this.$el,
        data: {
          x: 'Date', //bind the x axis to the 'Date' data set
          xFormat: '%m/%d/%Y %H:%M',
          columns: [ this.date, this.data ]
        },
        axis: {
          x: {
            type: 'timeseries', // the x axis has a timeseries data type
            tick: {
              // the format shown when the mouse hovers over that dot
              format: '%m/%d %H:%M'
              // fit: false, if you want to keep the x axis ticks from sticking to the data points
              // count: 4 if you want to set the ticks to a fixed ammount
            }
          },
          y : {
            tick: {
              // round the numbers on the y axis to a max of 10 decimal places
              // this gets the y axis numbers behaving and not getting too long
              format: function(d) { return +d.toFixed(10) }
            }
          }
        },
        // allow the user to zoom in and scroll around on the map
        zoom: {
            enabled: true
        },
      });
    },
  }
};
</script>

<style lang="css" scoped>
</style>
