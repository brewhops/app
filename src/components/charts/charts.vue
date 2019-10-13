<template>
  <div id="charts" class="grid">
    <chart
      class="chart col-6"
      v-bind:title="'pH'"
      v-bind:date="pHData.map(elm => elm.date)"
      v-bind:data="pHData.map(elm => elm.data)"
    />
    <chart
      class="chart col-6"
      v-bind:title="'ABV'"
      v-bind:date="abvData.map(elm => elm.date)"
      v-bind:data="abvData.map(elm => elm.data)"
    />
    <chart
      class="chart col-6"
      v-bind:title="'SG'"
      v-bind:date="fermentationData.map(elm => elm.date)"
      v-bind:data="fermentationData.map(elm => elm.data)"
    />
    <chart
      class="chart col-6"
      v-bind:title="'Temperature'"
      v-bind:date="tempData.map(elm => elm.date)"
      v-bind:data="tempData.map(elm => elm.data)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import chart from '@/components/charts/chart.vue';
import moment, { unix, months, Moment } from 'moment';

interface IChartsState {
  fermentationData: any[];
  pHData: any[];
  abvData: any[];
  tempData: any[];
}

export default Vue.extend({
  name: 'charts',
  props: ['batch', 'chart-load'],
  components: {
    chart
  },

  data(): IChartsState {
    return {
      fermentationData: [],
      pHData: [],
      abvData: [],
      tempData: []
    };
  },

  async beforeMount() {
    this.loadGraphData(
      this.batch ? this.batch.id : undefined,
      this.batch ? this.batch.recipe_id : undefined
    );
  },

  methods: {
    async loadGraphData(batchId: any, recipeId: any) {
      let previousBatches: Batch[] = [];
      try {
        const { data } = await this.$http.get(
          `${process.env.VUE_APP_API}/batches/recipe/${recipeId}/`
        );
        previousBatches = <Batch[]>data.sort((a: Batch, b: Batch) => {
          return moment.utc(b.started_on).diff(moment.utc(a.started_on));
        });
      } catch (err) {
        console.error(err);
      }

      let currentBatchIdx: any;
      previousBatches.some((b, i) => {
        currentBatchIdx = i;

        return b.id === batchId;
      });

      previousBatches = previousBatches.splice(currentBatchIdx, 10);

      const startDate = this.batch ? moment(this.batch.started_on) : undefined;

      let formattedData: any[] = [];

      try {
        formattedData = await Promise.all(
          previousBatches.map(async (batch, i) => {
            const response = await this.$http.get(
              `${process.env.VUE_APP_API}/versions/batch/${batch.id}/`
            );

            const versions = (response.data as Version[])
              .map((v: Version) => {
                v.measured_on = moment(v.measured_on);

                return v;
              })
              .sort((a: Version, b: Version) => {
                return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
              });

            const sg = versions.map(v => v.sg);
            const ph = versions.map(v => v.ph);
            const abv = versions.map(v => v.abv);
            const temp = versions.map(v => v.temperature);

            const date = versions.map(v => v.measured_on) as Moment[];
            const days = date.map(d =>
              moment(startDate).add(moment.duration(d.diff(date[0])).asMilliseconds(), 'ms')
            );

            return {
              sg: {
                data: [batch.name, ...sg],
                date: [`Days${i}`, ...days]
              },
              ph: {
                data: [batch.name, ...ph],
                date: [`Days${i}`, ...days]
              },
              abv: {
                data: [batch.name, ...abv],
                date: [`Days${i}`, ...days]
              },
              temp: {
                data: [batch.name, ...temp],
                date: [`Days${i}`, ...days]
              }
            };
          })
        );
      } catch (err) {
        console.error(err);
      }

      this.fermentationData = formattedData.map((e: any) => e.sg);
      this.pHData = formattedData.map((e: any) => e.ph);
      this.abvData = formattedData.map((e: any) => e.abv);
      this.tempData = formattedData.map((e: any) => e.temp);
      this.$emit('loaded');
    }
  }
});
</script>
