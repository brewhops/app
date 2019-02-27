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

      <div id="charts" v-if="versions && batch_id">
        <chart
          class="chart"
          v-bind:title="'pH'"
          v-bind:date="getData('measured_on')"
          v-bind:data="getData('ph')"
        />
        <chart
          class="chart"
          v-bind:title="'ABV'"
          v-bind:date="getData('measured_on')"
          v-bind:data="getData('abv')"
        />
        <chart
          class="chart"
          v-bind:title="'SG'"
          v-bind:date="getData('measured_on')"
          v-bind:data="getData('sg')"
        />
        <chart
          class="chart"
          v-bind:title="'Temperature'"
          v-bind:date="getData('measured_on')"
          v-bind:data="getData('temperature')"
        />
      </div>

      <div v-if="batch_id && versions && batch">
        <p>Versions</p>
        <table>
          <tr>
            <th v-for="title in version_titles">{{ title }}</th>
          </tr>
          <tr v-for="version in versions">
            <td>{{ formatDate(version.measured_on) }}</td>
            <td>{{ version.sg }}</td>
            <td>{{ version.ph }}</td>
            <td>{{ version.abv }}</td>
            <td>{{ version.temperature }}</td>
            <td>{{ version.pressure }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router';
import { logout } from '../utils';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Batch, Version } from '../types';
import { Moment } from 'moment';
import chart from './chart.vue';
import NavbarComponent from './navbar.vue';

interface IHistoryState {
  batch_titles: string[];
  version_titles: string[];
  mobile: boolean;
  batch_id: number | string;
  batches: Batch[];
  batch: Batch;
  versions: Version[];
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
      versions: []
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
    logout,
    home() {
      router.push('/');
    },
    getData(key: string) {
      return this.versions.map(v => v[key]);
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

        this.versions = (batchResponse.data as Version[])
          .map((v: Version) => {
            v.measured_on = moment(v.measured_on);
            return v;
          })
          .sort((a: Version, b: Version) => {
            return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
          });
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
      const rows = this.versions.map((v: Version) => [
        v.measured_on,
        v.sg,
        v.ph,
        v.abv,
        v.temperature,
        v.pressure
      ]);
      const csvHeader = 'data:text/csv;charset=utf-8,';
      const batchHeader = `${this.batch_titles.toString()}\r\n`;
      const versionsHeader = `${this.version_titles.toString()}\r\n`;
      const batchContent = `${[
        this.batch.volume,
        this.batch.bright,
        this.batch.generation,
        this.batch.started_on,
        this.batch.completed_on
      ].toString()}\r\n`;
      const versionContent = `${rows.map(row => `${row.join(',')},`).join('\r\n')}`;
      const csvContent = `${csvHeader}${batchHeader}${batchContent}${versionsHeader}${versionContent}`;

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
  z-index: -1

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
