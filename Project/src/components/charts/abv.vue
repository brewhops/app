<template>
  <div id="abvChart"></div>
</template>

<script>
// import the c3 javascript code
const c3 = require('c3')
// import the c3 css code
// if you dont specify a starting location, webpack will look in the node_modules folder
import 'c3/c3.min.css'

export
default {
  name: 'abv-chart',
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
          ['ABV', 1.2, 5.15, 6.33, 6.57, 6.7, 6.73]
        ]
      },
      axis: {
        x: {
          type: 'timeseries' // the x axis has a timeseries data type
        }
      }
    });
  }
};
</script>

<style lang="css" scoped>
</style>
