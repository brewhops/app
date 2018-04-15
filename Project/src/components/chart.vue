<template>
</template>

<script>
// import the c3 javascript code
const c3 = require('c3')
// import the c3 css code
// if you dont specify a starting location, webpack will look in the node_modules folder
import 'c3/c3.min.css'

export
default {
  name: 'chart',
  props: ['date', 'data'],
  data() {
    return {};
  },
  mounted: function() {
    let data = this.data
    let date = this.date
    console.log(data);
    c3.generate({
      bindto: this.$el,
      data: {
        x: 'Date', //bind the x axis to the 'Date' data set
        xFormat: '%m/%d/%Y %H:%M',
        columns: [ date, data ]
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
