<template lang="html">
  <div>
    <div class="header" v-if="!mobile">
      <router-link to="login">Logout</router-link>
      <h2>Batch History</h2>
    </div>
    <navbar v-bind:activeState="[false, true, false, false]" />
    <div id="content">
      <div>
        <h2>Batch</h2>
        <select v-model="batch_id" v-on:change="batchChoose">
          <option disabled value="">Batch</option>
          <option v-for="(batch, idx) in batches" v-bind:key="idx" v-bind:value="batch.id">{{
            batch.name
          }}</option>
        </select>
      </div>
      <table v-if="batch_id && batch">
        <tr>
          <th v-for="title in batch_titles">{{ title }}</th>
        </tr>
        <tr>
          <td>{{ batch.volume }}</td>
          <td>{{ batch.bright }}</td>
          <td>{{ batch.generation }}</td>
          <td>{{ formatDate(batch.started_on) }}</td>
          <td>{{ formatDate(batch.completed_on) }}</td>
        </tr>
      </table>

      <div id="charts">
        <chart class="chart" v-bind:date="history.date" v-bind:data="history.ph"></chart>
        <chart class="chart" v-bind:date="history.date" v-bind:data="history.abv"></chart>
        <chart class="chart" v-bind:date="history.date" v-bind:data="history.sg"></chart>
        <chart class="chart" v-bind:date="history.date" v-bind:data="history.temp"></chart>
      </div>

      <div v-if="batch_id && histories && batch">
        <p>Versions</p>
        <table>
          <tr>
            <th v-for="title in version_titles">{{ title }}</th>
          </tr>
          <tr v-for="history in histories">
            <td>{{ formatDate(history.measured_on) }}</td>
            <td>{{ history.sg }}</td>
            <td>{{ history.ph }}</td>
            <td>{{ history.abv }}</td>
            <td>{{ history.temperature }}</td>
            <td>{{ history.pressure }}</td>
          </tr>
        </table>
      </div>

      <a id="csvDownload" @click="downloadCSV()">
        <button v-if="batch_id" type="button" name="button">
          Download
        </button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Batch, Version } from '../types';
import { version } from 'punycode';
import chart from './chart.vue';
import NavbarComponent from './navbar.vue';

// tslint:disable: no-any

interface IHistoryState {
  batch_titles: string[];
  version_titles: string[];
  mobile: boolean;
  batch_id: number | string;
  batches: Batch[];
  batch: Batch;
  histories: any[];
  history: any;
}

export default Vue.extend({
  name: 'batch-history',
  components: { navbar: NavbarComponent, chart: chart },
  data(): IHistoryState {
    return {
      batch_titles: ['Volume', 'Bright', 'Generation', 'Date Started', 'Date Completed'],
      version_titles: ['Date', 'SG', 'pH', 'ABV', 'temp', 'pressure'],
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
      histories: [],
      history: {
        date: ['Date'],
        temp: ['Temperature'],
        abv: ['ABV'],
        sg: ['Specific Gravity'],
        ph: ['pH']
      }
    };
  },
  async beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    try {
      const response = await this.$http.get(`${process.env.API}/batches/`);
      this.batches = <Batch[]>response.data;
      this.batches.sort((a: any, b: any) => a.id - b.id);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    home() {
      if (this.mobile) {
        router.push('/home-mobile');
      }
      router.push('/');
    },
    formatDate(date: string | null) {
      return date ? moment(date).format('MM-DD-YYYY') : '';
    },
    async batchChoose() {
      // filter out all the batches that aren't ours, and set that one element
      // to our batch object
      this.batch = this.batches.filter(e => e.id === this.batch_id)[0];

      // when the user chooses a batch, get the info on that batch
      try {
        const batchResponse = await this.$http.get(
          `${process.env.API}/versions/batch/${this.batch_id}`
        );

        this.histories = batchResponse.data;
        const versions: Version[] = (batchResponse.data as Version[])
          .map((v: Version) => {
            v.measured_on = moment(v.measured_on);
            return v;
          })
          .sort((a: Version, b: Version) => {
            return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
          });

        for (const version of versions) {
          this.history.date.push(version.measured_on);
          this.history.temp.push(version.temperature);
          this.history.abv.push(version.abv);
          this.history.sg.push(version.sg);
          this.history.ph.push(version.ph);
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
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
      let rows: (string | number | undefined)[][] = [];
      rows.push(this.batch_titles);
      rows.push([
        this.batch.volume,
        this.batch.bright,
        this.batch.generation,
        this.batch.started_on,
        this.batch.completed_on
      ]);
      rows.push(this.version_titles);
      rows = rows.concat(
        this.histories.map(history => [
          history.measured_on,
          history.sg,
          history.ph,
          history.abv,
          history.temperature,
          history.pressure
        ])
      );

      let csvHeader = 'data:text/csv;charset=utf-8,';
      let csvContent = `${csvHeader}${rows.map(row => `${row.join(',')},`).join('\r\n')}`;

      return csvContent;
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

  p {
    color: Teal;
    font-weight: bold;
  }

  #charts {
    display grid
    justify-content center
    grid-template-columns repeat(2, 48vw)
    +less-than(tablet) {
      grid-template-columns 92vw
    }
    .chart {
      margin-left 5vw
      margin-right 5vw
    }
  }

  table {
    border-collapse: collapse;
    border: 1px solid black;
    tr {
      td, th {
        padding: 10px;
        border-left: 1px solid black;
      }
    }
  }
}
</style>
