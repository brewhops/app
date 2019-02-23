<template>
  <div>
    <div class="header">
      <a v-on:click="logout">Logout</a>
      <h2>Tank Data</h2>
    </div>
    <navbar v-bind:activeState="[false, false, false, false]" />
    <div class="title">
      <h3>Tank {{ tankInfo.name }}</h3>
    </div>
    <div v-if="this.tank" id="content">
      <div v-if="this.tank.in_use" id="info-content">
        <div id="tank">
          <h2>Info</h2>
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

          <recipe id="recipe" v-bind:recipe="recipe"></recipe>
        </div>

        <div id="entry">
          <data-entry
            v-bind:tank="tank"
            v-bind:batch="batch"
            v-bind:recipe="recipe"
            v-bind:activeTask="task"
            @newDataCallback="loadData"
          >
          </data-entry>
        </div>
      </div>
      <div v-else id="new-batch">
        <new-batch :tank="this.tank" />
      </div>

      <div v-if="this.tank.in_use" v-show="versions.length > 0" id="data">
        <h2>Batch History</h2>
        <div id="charts">
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
            v-bind:title="'Tempurature'"
            v-bind:date="getData('measured_on')"
            v-bind:data="getData('temperature')"
          />
        </div>
      </div>
    </div>
    <div v-else class="center">
      <loader></loader>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import recipe from './recipe.vue';
import chart from './chart.vue';
import dataEntry from './data-entry.vue';
import navbar from './navbar.vue';
import newBatch from './new-batch.vue';
import loader from './loader.vue';
import { logout } from '../utils';
import router from '../router';
import Cookie from 'js-cookie';

import moment, { unix, months, Moment } from 'moment';
import { Batch, Tank, Task, Action, Version, Recipe } from '../types';

// tslint:disable: no-any
interface ITankInfoState {
  tankInfo: any;
  batch?: Batch;
  versions: Version[];
  tank?: Tank;
  task?: Task;
  recipe?: Recipe;
  action?: Action;
  doneLink?: any;
  home?: any;
  mobile?: any;
  debugging?: string;
}

export default Vue.extend({
  name: 'tank-info',
  components: {
    navbar,
    recipe,
    chart,
    dataEntry,
    newBatch,
    loader
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
      doneLink: '',
      home: '',
      mobile: false,
      debugging: '',
      tank: undefined,
      task: undefined,
      batch: undefined,
      versions: [],
      recipe: undefined,
      action: undefined
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
      const tank: Tank = response.data as Tank;
      this.tank = tank;
      this.tankInfo = {
        ...this.tankInfo,
        id: tank.id,
        name: tank.name,
        status: tank.status,
        in_use: tank.in_use
      };
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.debugging = 'Debugging Flag: Response error, cant access tanks page';
    }

    await this.loadData();
  },
  methods: {
    logout,
    getData(key: string) {
      return this.versions.map((v: Version) => v[key]);
    },
    async loadData() {
      await this.loadBatchData();
      await this.loadTaskData();
      await this.loadHistoryData();
    },
    async loadBatchData() {
      try {
        const response = await this.$http.get(
          `${process.env.API}/batches/tank/${this.tankInfo.id}`
        );

        const openBatches: Batch[] = (response.data as Batch[]).filter(
          (b: Batch) => b.completed_on === null
        );

        let batch: Batch | undefined;
        if (openBatches.length > 1) {
          this.debugging = 'Debugging Flag: more than one open batch';

          // Use the most recently opened batch
          batch = openBatches.sort((a: Batch, b: Batch) => {
            return moment.utc(b.started_on).diff(moment.utc(a.started_on));
          })[0];
        } else if (openBatches.length == 1) {
          // Found only open batch
          batch = openBatches[0];
        }

        // Set the current batch
        this.batch = batch;

        if (batch) {
          // Populate the view model
          this.tankInfo.batch_id = batch.id;
          this.tankInfo.batch_name = batch.name;
          this.tankInfo.bright = batch.bright;
          this.tankInfo.generation = batch.generation;
          this.tankInfo.volume = batch.volume;
          this.tankInfo.recipe_id = batch.recipe_id;
        } else {
          // Update the view model
          this.tankInfo.batch_id = '';
          this.tankInfo.batch_name = '';
          this.tankInfo.bright = '';
          this.tankInfo.generation = '';
          this.tankInfo.volume = '';
          this.tankInfo.recipe_id = '';
        }

        let recipe: Recipe | undefined;
        if (batch) {
          // Get the recipe
          const recipeResponse = await this.$http.get(
            `${process.env.API}/recipes/id/${batch.recipe_id}`
          );
          recipe = recipeResponse.data;
        }

        this.recipe = recipe;
      } catch (err) {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      }
    },
    async loadTaskData() {
      if (this.batch) {
        try {
          const response = await this.$http.get(`${process.env.API}/tasks/batch/${this.batch.id}`);
          const batchTasks: Task[] = response.data as Task[];

          const activeTasks: Task[] = batchTasks.filter((t: Task) => !t.completed_on);

          let task: Task | undefined;
          if (activeTasks.length > 1) {
            this.debugging = 'Debugging Fal: more than one active task for batch';

            // Use the most recently opened task
            task = activeTasks.sort((a: Task, b: Task) => {
              return moment.utc(b.added_on).diff(moment.utc(a.added_on));
            })[0];
          } else if (activeTasks.length === 1) {
            // Only one active task
            task = activeTasks[0];
          }

          this.task = task;

          let action: Action | undefined;
          if (task) {
            // get the action name associated with the task
            const actionResponse = await this.$http.get(
              `${process.env.API}/actions/id/${task.action_id}`
            );
            action = actionResponse.data as Action;

            this.tankInfo.action = action.name;
            this.tankInfo.time = moment(task.added_on).format('MM/DD/YY H:mm');
          } else {
            this.tankInfo.action = '';
          }

          this.action = action;
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
        }
      }
    },
    async loadHistoryData() {
      if (this.batch) {
        try {
          const response = await this.$http.get(
            `${process.env.API}/versions/batch/${this.tankInfo.batch_id}`
          );

          this.versions = [];
          this.versions = (response.data as Version[])
            .map((v: Version) => {
              v.measured_on = moment(v.measured_on);
              return v;
            })
            .sort((a: Version, b: Version) => {
              return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
            });

          if (this.versions.length > 0) {
            // Set current data
            const lastVersion = this.versions[this.versions.length - 1];

            this.tankInfo.ABV = lastVersion.abv;
            this.tankInfo.pH = lastVersion.ph;
            this.tankInfo.temp = lastVersion.temperature;
            this.tankInfo.SG = lastVersion.sg;
            this.tankInfo.pressure = lastVersion.pressure;
            // use a lowercase h to change the hours from 24 to 12
            // the mm sets the minute with a leading 0
            this.tankInfo.time = (lastVersion.measured_on as Moment).format('MM/DD/YY H:mm');
          } else {
            this.tankInfo.ABV = '';
            this.tankInfo.pH = '';
            this.tankInfo.temp = '';
            this.tankInfo.SG = '';
            this.tankInfo.pressure = '';
          }
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
        }
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

.title
  display flex
  width 100vw
  justify-content center
  align-items center

.center
  display flex
  width 100vw
  height 90vh
  justify-content center
  align-items center

#info-content
  display grid
  grid-template-columns 45vw 45vw

  grid-template-areas "tank entry"
  width 90vw
  margin auto

  +less-than(tablet)
    grid-template-columns 90vw
    grid-template-areas "tank" "entry" "recipe"

  +less-than(mobile)
    grid-template-columns 90vw
    grid-template-areas "tank" "recipe"

#new-batch
  display: grid
  grid-template-columns: auto
  justify-content: center
  margin: auto
  margin-top: 30px

#recipe
  margin-top 30px

#entry
  +less-than(tablet)
    margin auto

#data
  justify-content center
  width 90vw
  margin auto
  margin-top 30px
  #charts
    display grid
    justify-content center
    grid-template-columns repeat(2, 43vw)
    +less-than(tablet)
      grid-template-columns 90vw
    .chart
      margin-left 1vw
      margin-right 1vw
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
