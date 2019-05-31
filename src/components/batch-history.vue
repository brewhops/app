<template lang="html">
  <div>
    <div class="header">
      <router-link to="login">Logout</router-link>
      <h2>Batch History</h2>
    </div>
    <navbar v-bind:activeState="[false, true, false, false]" />
    <div id="content">
      <div>
        <h2>Batch</h2>
        <div>
          <select v-model="batch_id" v-on:change="batchChoose">
            <option disabled value="">Batch</option>
            <option v-for="(batch, idx) in batches" v-bind:key="idx" v-bind:value="batch.id">{{
              batch.name
            }}</option>
          </select>
          <a id="csvDownload" @click="downloadCSV()">
            <button v-if="batch_id" type="button" name="button">
              Download CSV
            </button>
          </a>
        </div>
      </div>
      <div v-if="batch_id && batch">
        <div class="tables">
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
        <div id="charts">
          <chart
            class="chart"
            v-bind:title="'pH'"
            v-bind:date="pHData.map(elm => elm.date)"
            v-bind:data="pHData.map(elm => elm.data)"
          />
          <chart
            class="chart"
            v-bind:title="'ABV'"
            v-bind:date="abvData.map(elm => elm.date)"
            v-bind:data="abvData.map(elm => elm.data)"
          />
          <chart
            class="chart"
            v-bind:title="'SG'"
            v-bind:date="fermentationData.map(elm => elm.date)"
            v-bind:data="fermentationData.map(elm => elm.data)"
          />
          <chart
            v-bind:title="'Temperature'"
            v-bind:date="tempData.map(elm => elm.date)"
            v-bind:data="tempData.map(elm => elm.data)"
          />
        </div>

        <div class="tables">
          <div>
            <data-table class="table" v-bind:title="'Tasks'" v-bind:data="tasks"
            v-bind:headers="task_titles" v-bind:fields="[ t => actions.filter(a => a.id ===
            t.action_id)[0].name, t => getEmployeeName(employees.filter(e => e.id ===
            t.employee_id)[0]) || "N/A", t => formatDate(t.added_on), t =>
            formatDate(t.completed_on) ]" />
          </div>
          <div>
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
import router from '../router';
import { logout } from '../utils';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Batch, Version, Task, Employee, Action } from '../types';
import { Moment } from 'moment';
import chart from './chart.vue';
import loader from './loader.vue';
import NavbarComponent from './navbar.vue';
import dataTable from './data-table.vue';
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
  components: { navbar: NavbarComponent, chart: chart, dataTable: dataTable, loader: loader },
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
      const response = await this.$http.get(`${process.env.API}/batches/`);
      const employees = await this.$http.get(`${process.env.API}/employees/`);
      const actions = await this.$http.get(`${process.env.API}/actions/`);
      this.employees = <Employee[]>employees.data;
      this.actions = <Action[]>actions.data;
      this.batches = orderBy(<Batch[]>response.data, (b: Batch) => b.name, 'desc');
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    logout,
    home() {
      router.push('/');
    },
    getEmployeeName(employee: Employee) {
      let name;
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
            `${process.env.API}/versions/batch/${this.batch_id}`
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
            `${process.env.API}/tasks/batch/${this.batch_id}`
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
      dates.sort((a: string | Moment, b: string | Moment) => {
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
    async loadGraphData(batchId, recipeId) {
      const response = await this.$http.get(`${process.env.API}/batches/recipe/${recipeId}`);

      let previousBatches: Batch[] = (response.data as Batch[]).sort((a: Batch, b: Batch) => {
        return moment.utc(b.started_on).diff(moment.utc(a.started_on));
      });
      let currentBatchIdx;
      previousBatches.some((b, i) => {
        currentBatchIdx = i;
        return b.id === batchId;
      });
      previousBatches = previousBatches.splice(currentBatchIdx, 10);

      const startDate = moment(this.batch!.started_on);
      const formattedData = await Promise.all(
        previousBatches.map(async (batch, i) => {
          const response = await this.$http.get(`${process.env.API}/versions/batch/${batch.id}`);

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
@import '../styles/breakpoints'
#content {
  display: grid;
  justify-items: center;
  text-align: center;
  min-height: 60vh;
  z-index: -1;

  p {
    color: Teal;
    font-weight: bold;
  }
    & /deep/ tr {
      td, th {
    @media screen and (max-width: 540px){
      font-size: 14px
      padding: 5px
    }
    @media screen and (max-width: 480px){
      font-size: 12px
    }
    @media screen and (max-width: 414px){
      font-size 12px
    }
    @media screen and (max-width: 360px){
      font-size 11px
    }
    @media screen and (max-width: 325px){
      padding: 4px
      font-size 9px
    }
      padding: 10px;
      border-left: 1px solid black;
      }
    }

}
  #charts{
    display grid
    justify-content center
    grid-template-columns repeat(2, 48vw)
    +less-than(tablet) {
      justify-content center
      grid-template-columns 92vw
    }
    .chart {
      +less-than(tablet) {
        margin-left 3vw
        margin-right 5vw

      }
      margin-left 5vw
      margin-right 5vw
    }
  }

  table {
    background-color: red;
    +less-than(tablet) {
      justify-content center
      grid-template-columns 92vw
    border-collapse: collapse;
    }
  }
</style>
