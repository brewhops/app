<template lang="html">
  <div>
    <div id="content">
      <div>
        <h2>Tank History</h2>
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
          <td>{{ formatDate(history.started_on) }}</td>
          <td>{{ formatDate(history.completed_on) }}</td>
          <td>{{ getEmployeeName(employees.filter(e => e.id === history.update_user)[0]) }}</td>
        </tr>
      </table>

      <a id="csvDownload" @click="downloadCSV()">
        <button v-if="tank_id" type="button" name="button">
          Download
        </button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '@/router';

import Cookie from 'js-cookie';
import moment from 'moment';
import { Tank, Employee } from '@/types/index';
import { orderBy } from 'natural-orderby';

// tslint:disable: no-any

interface ITankHistoryState {
  mobile: boolean;
  tank_id: number | string;
  tanks: Tank[];
  tank: Tank;
  histories: any[];
  employees: Employee[];
}

export default Vue.extend({
  name: 'tank-history',
  data(): ITankHistoryState {
    return {
      mobile: false,
      tank_id: '',
      tanks: [],
      tank: {
        client_id: undefined,
        id: -1,
        name: '',
        status: '',
        in_use: false
      },
      histories: [],
      employees: []
    };
  },
  async beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    try {
      const response = await this.$http.get(`${process.env.VUE_APP_API}/tanks/`);
      this.tanks = orderBy(<Tank[]>response.data, (t: Tank) => t.name, 'asc');
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    home() {
      router.push('/');
    },
    formatDate(date: string | null) {
      return date ? moment(date).format('MM-DD-YYYY') : '';
    },
    getEmployeeName(employee: Employee) {
      let name = 'N/A';
      if (employee && employee.first_name && employee.last_name)
        name = `${employee.first_name} ${employee.last_name}`;
      return name;
    },
    async tankChoose() {
      // filter out all the tanks that aren't ours, and set that one element
      // to our tank object
      this.tank = this.tanks.filter(e => e.id === this.tank_id)[0];

      // when the user chooses a batch, get the info on that batch
      try {
        const tankResponse = await this.$http.get(
          `${process.env.VUE_APP_API}/batches/tank/${this.tank_id}/`
        );
        const employeesResponse = await this.$http.get(`${process.env.VUE_APP_API}/employees/`);

        this.histories = tankResponse.data;
        this.employees = employeesResponse.data;
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    },
    downloadCSV() {
      const link = document.getElementById('csvDownload');
      if (link) {
        link.setAttribute('href', encodeURI(this.generateCSV()));
        link.setAttribute(
          'download',
          `tank_history_${this.tank.name}_(${moment().format('MM-DD-YYYY')}).csv`
        );
      }
    },
    generateCSV() {
      const rows: string[][] = this.histories.map(history => [
        history.name,
        history.volume,
        history.bright,
        history.generation,
        history.started_on,
        history.completed_on,
        history.update_user
      ]);

      // add header
      rows.unshift(['Name', 'Volume', 'Bright', 'Generation', 'Start Date', 'End Date', 'Updater']);

      const csvHeader = 'data:text/csv;charset=utf-8,';

      return `${csvHeader}${rows.map(row => `${row.join(',')},`).join('\r\n')}`;
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
    border: 1px solid black;
    @media screen and (max-width: 630px){
      font-size: 14px
    }
    @media screen and (max-width: 500px){
      font-size:10px
    }
    @media screen and (max-width: 395px){
      font-size 9px
    }
    @media screen and (max-width: 330px){
      font-size 8px
    }

    tr {
      td, th {
        padding: 10px;
        @media screen and (max-width: 630px){
          padding: .5em
        }
        border-left: 1px solid black;
      }
    }
  }
}
</style>
