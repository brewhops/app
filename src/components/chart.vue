<template> </template>

<script lang="ts">
import Vue from 'vue';
import c3 from 'c3';
import 'c3/c3.min.css';
import 'polyfill-array-includes';

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

  focusItems: any[];
}

export default Vue.extend({
  name: 'chart',
  props: ['title', 'date', 'data'],
  data() {
    return {} as IChart;
  },
  watch: {
    // when the data array changes, redraw the chart
    data() {
      this.buildChart();
    },
    date() {
      this.buildChart();
    }
  },
  methods: {
    buildChart() {
      this.focusItems = [];
      const zippedNames = this.date.map((a, i) => [a[0], this.data[i][0]]);

      const nameCount = {};
      const xs = zippedNames.reduce((map, elm, idx) => {
        // Handle possibility of duplicate names
        let name;
        if (!(elm[1] in nameCount)) {
          name = elm[1];
          nameCount[elm[1]] = 1;
        } else {
          name = `${elm[1]} - ${nameCount[elm[1]] + 1}`;
          nameCount[elm[1]] += 1;
        }
        map[name] = elm[0];
        return map;
      }, {});
      const columns = [...this.date, ...this.data];

      // create our chart
      const chart = c3.generate({
        // bind it to this instance of the component
        bindto: this.$el,
        title: {
          text: this.title
        },
        data: {
          xs: xs,
          //xFormat: '%m/%d/%Y %H:%M',
          order: 'desc',
          columns: columns
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
        },
        legend: {
          item: {
            onclick: id => {
              if (this.focusItems.includes(id)) {
                this.focusItems = this.focusItems.filter(v => v !== id);
              } else {
                this.focusItems.push(id);
              }
              chart.focus(this.focusItems);
            },
            onmouseover: id => {
              chart.focus([id, ...this.focusItems]);
            },
            onmouseout: id => {
              chart.focus(this.focusItems);
            }
          }
        }
      });

      if (zippedNames.length > 0) {
        this.focusItems.push(zippedNames[0][1]);
        chart.focus(this.focusItems);
      }
    }
  }
});
</script>

<style lang="css" scoped></style>
