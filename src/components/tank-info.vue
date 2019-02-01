<template>
  <div>
    <div class="header">
      <router-link v-bind:to="home">home</router-link>
      <h2>Tank Data</h2>
    </div>
    <div id="content">
      <div id="info-content">
        <div id="tank">
          <h2>Tank {{ tankInfo.name }}</h2>
          <table class="table">
            <tbody>
              <tr scope="row" v-if="tankInfo.action !== ''" class="important">
                <td>Action</td>
                <td>{{ tankInfo.action }}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{{ tankInfo.status }}</td>
              </tr>
              <tr>
                <td>Brand ID</td>
                <td>{{ tankInfo.recipe_id }}</td>
              </tr>
              <tr>
                <td>Batch Name</td>
                <td>{{ tankInfo.batch_name }}</td>
              </tr>
              <tr>
                <td>Generation</td>
                <td>{{ tankInfo.generation }}</td>
              </tr>
              <tr>
                <td>Volume</td>
                <td>{{ tankInfo.volume }}</td>
              </tr>
              <tr>
                <td>Bright</td>
                <td>{{ tankInfo.bright }}</td>
              </tr>
              <tr>
                <td>Temperature</td>
                <td>{{ tankInfo.temp }}º F</td>
              </tr>
              <tr>
                <td>Specific Gravity</td>
                <td>{{ tankInfo.SG }}</td>
              </tr>
              <tr>
                <td>pH</td>
                <td>{{ tankInfo.pH }}</td>
              </tr>
              <tr>
                <td>Pressure</td>
                <td>{{ tankInfo.pressure }}</td>
              </tr>
              <tr>
                <td>ABV</td>
                <td>{{ tankInfo.ABV }}%</td>
              </tr>
              <tr>
                <td>Time Last Updated</td>
                <td>{{ tankInfo.time }}</td>
              </tr>
            </tbody>
          </table>

          <recipe v-bind:recipeID="tankInfo.recipe_id"></recipe>
        </div>

        <div id="entry">
          <data-entry v-bind:tank_id="tankInfo.id" @newDataCallback="loadHistoryData"></data-entry>
        </div>
      </div>

      <div id="data">
        <h2>Brand History</h2>
        <div id="charts">
          <chart class="chart" v-bind:date="history.date" v-bind:data="history.ph"></chart>
          <chart class="chart" v-bind:date="history.date" v-bind:data="history.abv"></chart>
          <chart class="chart" v-bind:date="history.date" v-bind:data="history.sg"></chart>
          <chart class="chart" v-bind:date="history.date" v-bind:data="history.temp"></chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import recipe from './recipe.vue';
import chart from './chart.vue';
import dataEntry from './data-entry.vue';

import router from '../router/index.js';
import Cookie from 'js-cookie';

import moment from 'moment';
import { Batch, Tank, Task, Action, Version } from '../types';

// tslint:disable: no-any
interface ITankInfoState {
  tankInfo?: any;
  doneLink?: any;
  history?: any;
  home?: any;
  mobile?: any;
  debugging?: string;
}

export default Vue.extend({
  name: 'tank-info',
  components: {
    recipe,
    chart,
    dataEntry
  },
  data(): ITankInfoState {
    return {
      tankInfo: {
        id: Number(this.$route.params.tankID),
        recipe_id: undefined,
        batch_id: undefined,
        batch_name: '',
        volume: '',
        bright: '',
        generation: '',
        SG: '',
        pH: '',
        ABV: '',
        temp: '',
        status: '',
        time: '',
        name: '',
        action: '',
        in_use: undefined
      },
      history: {
        date: ['Date'],
        temp: ['Temperature'],
        abv: ['ABV'],
        sg: ['Specific Gravity'],
        ph: ['pH']
      },
      doneLink: '',
      home: '',
      mobile: false,
      debugging: ''
    };
  },
  // tslint:disable-next-line:max-func-body-length
  async beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
      this.doneLink = '/data-entry';
      this.home = '/home-mobile';
    } else {
      this.doneLink = '/home';
      this.home = '/home';
    }

    try {
      const response = await this.$http.get(
        `${process.env.API}/tanks/id/${this.$route.params.tankID}`
      );
      const { id, name, status, in_use }: Tank = response.data as Tank;
      this.tankInfo = {
        ...this.tankInfo,
        id,
        name,
        status,
        in_use
      };
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.debugging = 'Debugging Flag: Response error, cant access tanks page';
    }

    await this.loadBatchData();
    await this.loadHistoryData();
  },
  methods: {
    async loadBatchData() {
      try {
        const response = await this.$http.get(`${process.env.API}/batches`);
        const batches: Batch[] = response.data as Batch[];
        // if our batch tankID is the tankID we are looking for set some data
        for (const batch of batches) {
          if (batch.tank_id === this.tankInfo.id) {
            const {
              id: batch_id,
              name: batch_name,
              bright,
              generation,
              volume,
              recipe_id
            }: Batch = batch;
            this.tankInfo = {
              ...this.tankInfo,
              batch_id,
              batch_name,
              bright,
              generation,
              volume,
              recipe_id
            };
          }
        }
      } catch (err) {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      }

      try {
        const response = await this.$http.get(`${process.env.API}/tasks`);
        const tasks: Task[] = response.data as Task[];
        let actionID;
        for (const task of tasks) {
          // if the batch is the one we are looking for
          if (task.batch_id === this.tankInfo.batch_id) {
            // set our actionID and break out of the loop
            actionID = task.action_id;
            break;
          }
        }
        // if our actionID was set
        if (actionID >= 0) {
          // get the action associated with that ID
          const actionResponse = await this.$http.get(`${process.env.API}/actions/id/${actionID}`);
          const { name }: Action = actionResponse.data as Action;
          this.tankInfo.action = name;
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    },
    async loadHistoryData() {
      try {
        const response = await this.$http.get(
          `${process.env.API}/versions/batch/${this.tankInfo.batch_id}`
        );

        const versions: Version[] = (response.data as Version[])
          .map((v: Version) => {
            v.measured_on = moment(v.measured_on);
            return v;
          })
          .sort((a: Version, b: Version) => {
            return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
          });

        this.history = {
          date: ['Date'],
          temp: ['Temperature'],
          abv: ['ABV'],
          sg: ['Specific Gravity'],
          ph: ['pH']
        };

        for (const version of versions) {
          this.history.date.push(version.measured_on);
          this.history.temp.push(version.temperature);
          this.history.abv.push(version.abv);
          this.history.sg.push(version.sg);
          this.history.ph.push(version.ph);
        }

        // Set current data
        const lastVersion = versions[versions.length - 1];
        this.tankInfo.ABV = lastVersion.abv;
        this.tankInfo.pH = lastVersion.ph;
        this.tankInfo.temp = lastVersion.temperature;
        this.tankInfo.SG = lastVersion.sg;
        this.tankInfo.pressure = lastVersion.pressure;
        // use a lowercase h to change the hours from 24 to 12
        // the mm sets the minute with a leading 0
        this.tankInfo.time = (lastVersion.measured_on as moment.Moment).format('MM/DD/YY H:mm');
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#info-content
  display grid
  grid-template-columns auto auto

  grid-template-areas "tank entry"
  width 92vw
  margin auto

  +less-than(tablet)
    grid-template-columns 92vw
    grid-template-areas "tank" "entry" "recipe"

  +less-than(mobile)
    grid-template-columns 92vw
    grid-template-areas "tank" "recipe"

#data
  justify-content center
  +less-than(mobile)
    display none
  #charts
    display grid
    justify-content center
    grid-template-columns repeat(2, 48vw)
    +less-than(tablet)
      grid-template-columns 92vw
    .chart
      margin-left 5vw
      margin-right 5vw
  h2
    text-align center


#tank
  text-align center
  justify-content center
  padding 15px
  table
    text-align left
    margin auto
    margin-top 30px
  h2, h3, h4
    text-align center
  grid-area tank

.important
  color red
  font-weight bold
</style>
