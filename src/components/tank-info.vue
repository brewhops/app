<template>
  <div>
    <div class="header">
      <router-link v-bind:to="home">home</router-link>
      <h2>Tank Data</h2>
    </div>
    <div id="content">
      <div id="data">
        <h2>Brand History</h2>
        <div id="charts">
          <chart v-bind:date="history.date" v-bind:data="history.temp"></chart>
          <chart v-bind:date="history.date" v-bind:data="history.sg"></chart>
          <chart v-bind:date="history.date" v-bind:data="history.abv"></chart>
          <chart v-bind:date="history.date" v-bind:data="history.ph"></chart>
        </div>
      </div>

      <div id="tank">
        <h2>Tank {{ tankInfo.name }}</h2>
        <table>
          <tr v-if="tankInfo.action !== ''" class="important">
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
        </table>

        <data-entry :tank_id="tankInfo.id"></data-entry>
      </div>
      <recipe v-bind:recipeID="tankInfo.recipe_id"></recipe>
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

    try {
      const response = await this.$http.get(
        `${process.env.API}/versions/batch/${this.tankInfo.batch_id}`
      );
      const versions: Version[] = response.data;
      let max = moment('1995-07-29');
      let date;
      for (const version of response.data) {
        const batchTime = moment(response.data.updated_at);
        if (batchTime > max) {
          max = moment(version.measured_on);
          this.tankInfo.ABV = version.abv;
          this.tankInfo.pH = version.ph;
          this.tankInfo.temp = version.temperature;
          this.tankInfo.SG = version.sg;
          this.tankInfo.pressure = version.pressure;
          // use a lowercase h to change the hours from 24 to 12
          // the mm sets the minute with a leading 0
          this.tankInfo.time = moment(version.updated_at).format('MM/DD/YY H:mm');
        }
        date = moment(version.measured_on).format('MM/DD/YY H:m');
        this.history.date.push(date);
        this.history.temp.push(version.temperature);
        this.history.abv.push(version.abv);
        this.history.sg.push(version.sg);
        this.history.ph.push(version.ph);
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'


#content
  margin 2vw
  display grid
  grid-template-columns auto 400px

  grid-template-areas "data tank" "data recipe"
  width 92vw

  +less-than(tablet)
    align-items flex-start

  +less-than(mobile)
    grid-template-columns 92vw
    grid-template-areas "tank" "recipe"

#data
  +less-than(mobile)
    display none
  grid-area data
  #charts
    display grid
    grid-template-columns repeat(2, 30vw)
    +less-than(tablet)
      grid-template-columns auto
  h2
    text-align center


#tank
  text-align center
  table
    text-align left
    margin auto
  h2, h3, h4
    text-align center
  grid-area tank

.important
  color red
  font-weight bold
</style>
