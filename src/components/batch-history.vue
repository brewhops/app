<template lang="html">
  <div>
    <div class="header" v-if="!mobile">
      <a v-on:click="home">home</a>
      <h2>Batch History</h2>
    </div>
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
      <table v-if="batch_id && histories && batch">
        <tr>
          <th>Date</th>
          <th>SG</th>
          <th>pH</th>
          <th>ABV</th>
          <th>temp</th>
          <th>pressure</th>
        </tr>
        <tr v-for="history in histories">
          <td>{{ history.measured_on }}</td>
          <td>{{ history.sg }}</td>
          <td>{{ history.ph }}</td>
          <td>{{ history.abv }}</td>
          <td>{{ history.temperature }}</td>
          <td>{{ history.pressure }}</td>
        </tr>
        <tr>
          <th>Volume</th>
          <th>Bright</th>
          <th>Generation</th>
          <th>Date Started</th>
          <th>Date Completed</th>
        </tr>
        <tr>
          <td>{{ batch.volume }}</td>
          <td>{{ batch.bright }}</td>
          <td>{{ batch.generation }}</td>
          <td>{{ formatDate(batch.date_started) }}</td>
          <td>{{ formatDate(batch.date_completed) }}</td>
        </tr>
      </table>

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
import { Batch } from '../types';

// tslint:disable: no-any

interface IHistoryState {
  mobile: boolean;
  batch_id: number | string;
  batches: Batch[];
  batch: Batch;
  histories: any[];
}

export default Vue.extend({
  name: 'batch-history',
  data(): IHistoryState {
    return {
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
      histories: []
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
      const rows: string[][] = this.histories.map(history => [...history]);

      // add header
      rows.unshift([
        'Date',
        'SG',
        'pH',
        'ABV',
        'temp',
        'pressure',
        'Volume',
        'Bright',
        'Generation',
        'Date Started',
        'Date Completed'
      ]);

      let csvHeader = 'data:text/csv;charset=utf-8,';
      let csvContent = `${csvHeader}${rows.map(row => `${row.join(',')},`).join('\r\n')}`;

      return csvContent;
    }
  }
});
</script>

<style lang="stylus" scoped>
#content {
  display: grid;
  justify-items: center;
  text-align: center;
  min-height: 60vh;

  p {
    color: Teal;
    font-weight: bold;
  }

  table {
    tr {
      td, th {
        padding: 10px;
        border-left: 1px solid black;
      }
    }
  }
}
</style>
