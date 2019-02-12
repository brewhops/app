<template> </template>

<script lang="ts">
import Vue from 'vue';
import c3 from 'c3';
import 'c3/c3.min.css';

// tslint:disable: no-any

interface IChart {
  name: any;
  props: any;
  watch: any;

  data?: any;
  x?: any;
  y?: any;
  zoom?: any;
  enabled?;
  xFormat?: any;
  columns?: any;
  axis?: any;
  // tslint:disable-next-line:no-reserved-keywords
  type?: any;
  tick?: any;
  format?: any;
}

export default Vue.extend({
  name: 'chart',
  props: ['title', 'date', 'data'],
  data() {
    return {};
  },
  watch: {
    // when the data array changes, redraw the chart
    data() {
      this.data.unshift(this.title);
      this.date.unshift('Date');
      // create our chart
      c3.generate({
        // bind it to this instance of the component
        bindto: this.$el,
        data: {
          x: 'Date',
          xFormat: '%m/%d/%Y %H:%M',
          columns: [this.date, this.data]
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
          y: {
            tick: {
              // round the numbers on the y axis to a max of 10 decimal places
              // this gets the y axis numbers behaving and not getting too long
              format(d) {
                return +d.toFixed(10);
              }
            }
          }
        },
        // allow the user to zoom in and scroll around on the map
        zoom: {
          enabled: true
        }
      });
    }
  }
});
</script>

<style lang="css" scoped></style>
