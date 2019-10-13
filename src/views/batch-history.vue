<template lang="html">
  <div class="content grid">
    <div class="paper selector">
      <h3>Batch</h3>
      <div>
        <select v-model="batch_id" v-on:change="batchChoose" class="dropdown">
          <option disabled value="">Batch</option>
          <option v-for="(batch, idx) in batches" v-bind:key="idx" v-bind:value="batch.id">{{
            batch.name
          }}</option>
        </select>
        <a id="csvDownload" @click="downloadCSV()">
          <button v-if="batch_id" type="button" name="button" class="btn-center">
            Download CSV
          </button>
        </a>
      </div>
    </div>
    <div class="grid col-12">
      <div v-if="batch_id && batch" class="grid col-12">
        <div class="tables col-12 paper">
          <data-table
            class="table"
            v-bind:title="''"
            v-bind:data="[batch]"
            v-bind:headers="batch_titles"
            v-bind:fields="[
              b => b.volume,
              b => b.bright,
              b => b.generation,
              b => formatDate(b.started_on),
              b => formatDate(b.completed_on)
            ]"
          />
        </div>
        <div id="charts" class="col-12 paper">
          <h4 class="col-12">Charts</h4>
          <charts v-bind:batch="batch" v-on:loaded="loading = false" />
        </div>
        <div class="paper col-12">
          <data-table
            class="table"
            v-bind:title="'Tasks'"
            v-bind:data="tasks"
            v-bind:headers="task_titles"
            v-bind:fields="[
              t => actions.filter(a => a.id === t.action_id)[0].name,
              t => getEmployeeName(employees.filter(e => e.id === t.employee_id)[0]),
              t => formatDate(t.added_on),
              t => formatDate(t.completed_on)
            ]"
          />
        </div>
        <div class="paper col-12">
          <data-table
            class="table"
            v-bind:title="'Version'"
            v-bind:data="versions"
            v-bind:headers="version_titles"
            v-bind:fields="[
              v => formatDate(v.measured_on),
              v => v.sg,
              v => v.ph,
              v => v.abv,
              v => v.temperature,
              v => v.pressure
            ]"
          />
        </div>
      </div>
      <div v-else-if="loading" class="center">
        <loader></loader>
      </div>
      <div v-else />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '@/router';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Batch, Version, Task, Employee, Action } from '@/types/index';
import { Moment } from 'moment';
import chart from '@/components/charts/chart.vue';
import charts from '@/components/charts/charts.vue';
import loader from '@/components/loader.vue';
import dataTable from '@/components/data-table.vue';
import { orderBy } from 'natural-orderby';

interface IHistoryState {
  batch_titles: string[];
  version_titles: string[];
  task_titles: string[];
  mobile: boolean;
  batch_id: number | string;
  batches: Batch[];
  batch: Batch;
  versions: Version[];
  tasks: Task[];
  employees: Employee[];
  actions: Action[];
  loading: boolean;
  fermentationData: any[];
  pHData: any[];
  abvData: any[];
  tempData: any[];
}

export default Vue.extend({
  name: 'batch-history',
  components: { chart: chart, dataTable: dataTable, loader: loader, charts: charts },
  data(): IHistoryState {
    return {
      batch_titles: ['Volume', 'Bright', 'Generation', 'Date Started', 'Date Completed'],
      version_titles: ['Date', 'SG', 'pH', 'ABV', 'temp', 'pressure'],
      task_titles: ['Action', 'Employee', 'Date Started', 'Date Completed'],
      mobile: false,
      batch_id: '',
      batches: [],
      batch: {
        name: '',
        generation: 0,
        volume: 0,
        bright: 0,
        recipe_id: 0,
        tank_id: 0,
        started_on: '',
        completed_on: ''
      },
      versions: [],
      tasks: [],
      employees: [],
      actions: [],
      loading: false,
      fermentationData: [],
      pHData: [],
      abvData: [],
      tempData: []
    };
  },
  async beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    try {
      const response = await this.$http.get(`${process.env.VUE_APP_API}/batches/`);
      const employees = await this.$http.get(`${process.env.VUE_APP_API}/employees/`);
      const actions = await this.$http.get(`${process.env.VUE_APP_API}/actions/`);
      this.employees = <Employee[]>employees.data;
      this.actions = <Action[]>actions.data;
      this.batches = orderBy(<Batch[]>response.data, (b: Batch) => b.name, 'desc');
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    home() {
      router.push('/');
    },
    getEmployeeName(employee: Employee) {
      let name = 'N/A';
      if (employee && employee.first_name && employee.last_name)
        name = `${employee.first_name} ${employee.last_name}`;
      return name;
    },
    getData(key: string, title?: string) {
      return [
        [
          title === undefined ? this.batch!.name : title,
          ...this.versions.map((v: Version) => v[key])
        ]
      ];
    },
    formatDate(date: string | null) {
      return date ? moment(date).format('MM-DD-YYYY') : '';
    },
    async batchChoose() {
      this.loading = true;
      // filter out all the batches that aren't ours, and set that one element
      // to our batch object
      this.batch = this.batches.filter(e => e.id === this.batch_id)[0];

      // when the user chooses a batch, get the info on that batch
      const [versions, tasks, ...arr] = await Promise.all([
        (async () => {
          const batchResponse = await this.$http.get(
            `${process.env.VUE_APP_API}/versions/batch/${this.batch_id}/`
          );

          return (batchResponse.data as Version[])
            .map((v: Version) => {
              v.measured_on = moment(v.measured_on);
              return v;
            })
            .sort((a: Version, b: Version) => {
              return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
            });
        })(),
        (async () => {
          const taskResponse = await this.$http.get(
            `${process.env.VUE_APP_API}/tasks/batch/${this.batch_id}/`
          );

          return (taskResponse.data as Task[]).map((t: Task) => {
            t.added_on = moment(t.added_on);
            return t;
          });
        })(),
        this.loadGraphData(this.batch.id, this.batch.recipe_id)
      ]);

      this.versions = versions;
      this.tasks = tasks;

      this.loading = false;
    },
    downloadCSV() {
      let link = document.getElementById('csvDownload');
      if (link) {
        link.setAttribute('href', encodeURI(this.generateCSV()));
        link.setAttribute(
          'download',
          `batch_history_${this.batch.name}_(${moment().format('MM-DD-YYYY')}).csv`
        );
      }
    },
    generateCSV() {
      const csvHeader = 'data:text/csv;charset=utf-8,';
      let dates = this.versions.map(v => v.measured_on).concat(this.tasks.map(t => t.added_on));
      dates.sort((a: string | Moment | undefined, b: string | Moment | undefined) => {
        return moment.utc(a).diff(moment.utc(b));
      });
      const content = dates.map(date => {
        let tasksOnDate = this.tasks.filter(t => t.added_on === date);
        let versionsOnDate = this.versions.filter(v => v.measured_on === date);
        let result: (string | number | undefined | Moment)[][] = [
          Array(Math.max(tasksOnDate.length, versionsOnDate.length))
        ].map(e => Array(9).map(a => ''));

        result.forEach(r => (r[0] = date));

        const versionRows = versionsOnDate
          .map((v: Version) => [
            String(v.sg),
            String(v.abv),
            String(v.ph),
            String(v.temperature),
            String(v.pressure)
          ])
          .forEach((v, i) => result[i].splice(1, v.length, ...v));

        const taskRows = tasksOnDate
          .map((t: Task) => [
            String(this.actions.filter(a => a.id == t.action_id)[0].name),
            String(this.getEmployeeName(this.employees.filter(e => e.id == t.employee_id)[0]))
          ])
          .forEach((t, i) => result[i].splice(6, t.length, ...t));

        return result;
      });
      const batchHeader = `${this.batch_titles}`;
      const versionsHeader = `${this.version_titles.filter(s => s.indexOf('Date') == -1)}`;
      const tasksHeader = `${this.task_titles.filter(s => s.indexOf('Date') == -1)}`;
      const versionContent = `${content.map(con => `${con.join(',')},`).join('\r\n')}`;
      return `${csvHeader}Date,${versionsHeader},${tasksHeader}\n${versionContent}`;
    },
    async loadGraphData(batchId: any, recipeId: any) {
      const response = await this.$http.get(
        `${process.env.VUE_APP_API}/batches/recipe/${recipeId}/`
      );

      let previousBatches: Batch[] = (response.data as Batch[]).sort((a: Batch, b: Batch) => {
        return moment.utc(b.started_on).diff(moment.utc(a.started_on));
      });
      let currentBatchIdx: any;
      previousBatches.some((b, i) => {
        currentBatchIdx = i;
        return b.id === batchId;
      });
      previousBatches = previousBatches.splice(currentBatchIdx, 10);

      const startDate = moment(this.batch!.started_on);
      const formattedData = await Promise.all(
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

      this.fermentationData = formattedData.map(e => e.sg);
      this.pHData = formattedData.map(e => e.ph);
      this.abvData = formattedData.map(e => e.abv);
      this.tempData = formattedData.map(e => e.temp);
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints';

.selector
  +greater-than(tablet)
    grid-column 5 / span 4
</style>
