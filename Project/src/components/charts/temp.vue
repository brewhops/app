<template>
  <div id="tempChart"></div>
</template>

<script>
// import the c3 javascript code
const c3 = require('c3')
// import the c3 css code
// if you dont specify a starting location, webpack will look in the node_modules folder
import 'c3/c3.min.css'

export
default {
  name: 'temp-chart',
  props: ['date', 'temp'],
  data() {
    return {};
  },
  mounted: function() {
    let temperature = this.temp
    let date = this.date
    console.log(date);
    c3.generate({
      bindto: this.$el,
      data: {
        x: 'Date', //bind the x axis to the 'Date' data set
        xFormat: '%m/%d/%Y %H:%M',
        columns: [
          date,
          temperature
        ]
      },
      axis: {
        x: {
          type: 'timeseries', // the x axis has a timeseries data type
          tick: {
            format: '%m-%d %H:%M'
          }
        }
      }
    });
  }
};
</script>

<style lang="css" scoped>
</style>
