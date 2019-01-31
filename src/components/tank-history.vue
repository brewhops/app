<template lang="html">
  <div>
    <div class="header" v-if="!mobile">
      <a v-on:click="home">home</a>
      <h2>Tank History</h2>
    </div>
    <div id="content">
      <div>
        <h2>Tank</h2>
        <select v-model="tank_id" v-on:change="tankChoose">
          <option disabled value="">Tank</option>
          <option v-for="(tank, idx) in tanks" v-bind:key="idx" v-bind:value="tank.id">{{
            tank.name
          }}</option>
        </select>
      </div>
      <table v-if="tank_id && histories && tank">
        <tr>
          <th>Name</th>
          <th>Volume</th>
          <th>Bright</th>
          <th>Generation</th>
          <th>Started</th>
          <th>Completed</th>
          <th>Updater</th>
        </tr>
        <tr v-for="history in histories">
          <td>{{ history.name }}</td>
          <td>{{ history.volume }}</td>
          <td>{{ history.bright }}</td>
          <td>{{ history.generation }}</td>
          <td>{{ history.started_on }}</td>
          <td>{{ history.completed_on }}</td>
          <td>{{ history.update_user }}</td>
        </tr>
      </table>

      <a id="csvDownload">
        <button v-if="tank_id" type="button" name="button">
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
import { Tank } from '../types';

// tslint:disable: no-any

interface ITankHistoryState {
  mobile: boolean;
  tank_id: number | string;
  tanks: Tank[];
  tank: Tank;
  histories: any[];
}

export default Vue.extend({
  name: 'tank-history',
  data(): ITankHistoryState {
    return {
      mobile: false,
      tank_id: '',
      tanks: [],
      tank: {
        id: -1,
        name: '',
        status: '',
        in_use: false
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
      const response = await this.$http.get(`${process.env.API}/tanks/`);
      this.tanks = <Tank[]>response.data;
      this.tanks.sort((a: any, b: any) => a.id - b.id);
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
    async tankChoose() {
      // filter out all the tanks that aren't ours, and set that one element
      // to our tank object
      this.tank = this.tanks.filter(e => e.id === this.tank_id)[0];

      // when the user chooses a batch, get the info on that batch
      try {
        const tankResponse = await this.$http.get(
          `${process.env.API}/batches/inTank/${this.tank_id}`
        );

        this.histories = tankResponse.data;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }

      // create our header
      const rows: string[][] = [
        ['Name', 'Volume', 'Bright', 'Generation', 'Start Date', 'End Date', 'Updater']
      ];

      // for each history element
      for (const history of this.histories) {
        // add in that history row
        rows.push([
          history.name,
          history.volume,
          history.bright,
          history.generation,
          // formated date in CSV or not?
          // moment(history.started_on).format('MM-DD-YYYY'),
          // moment(history.completed_on).format('MM-DD-YYYY'),
          history.started_on,
          history.completed_on,
          history.update_user
        ]);
      }

      this.histories = this.histories.map(element => ({
        ...element,
        started_on: moment(element.started_on).format('MM-DD-YYYY'),
        completed_on: element.completed_on ? moment(element.completed_on).format('MM-DD-YYYY') : ' '
      }));

      // create the header for the csv that we will download
      let csvContent = 'data:text/csv;charset=utf-8,';

      // for every row, add a comma to the end and some new line chars
      for (const row of rows) {
        csvContent = `${csvContent}${row}${'\r\n'}`;
      }

      // find the csvDownload link and set some info about what it links to
      // and what the download file should be called
      const link = document.getElementById('csvDownload');
      if (link) {
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute(
          'download',
          `tank_history_${this.tank.name}_(${moment().format('MM-DD-YYYY')}).csv`
        );
      }
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
    border-collapse: collapse;
    tr {
      td, th {
        padding: 10px;
        border-left: 1px solid black;
      }
    }
  }
}
</style>
