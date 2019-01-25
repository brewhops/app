<template>
  <div>
    <div class="header" v-if="mobile">
      <router-link to="/home-mobile">Home</router-link>
      <h2>Data Entry</h2>
    </div>
    <div id="dataEntry">
      <h2 v-if="!mobile">Data Entry</h2>
      <div id="formFields" class="grid">
        <div class="col-3">
          <h4>Tank</h4>
          <select v-model="tank_id" v-on:change="tankChoose">
            <option disabled value="">Tank</option>
            <option v-for="tank in tanks" v-bind:key="tank.id" v-bind:value="tank.id">{{
              tank.tank_id
            }}</option>
          </select>
        </div>
        <div class="col-3">
          <h4>Action</h4>
          <select v-model="action">
            <option value="">No Action</option>
            <option
              v-for="action_option in action_choice"
              v-bind:key="action_option.id"
              v-bind:value="action_option.id"
            >
              {{ action_option.name }}</option
            >
          </select>
        </div>
        <div class="col-3">
          <h4>Recipe</h4>
          <select v-model="recipe_id" required>
            <option disabled value="">Recipe</option>
            <option v-for="recipe in recipes" v-bind:key="recipe.id" v-bind:value="recipe.id">{{
              recipe.airplane_code
            }}</option>
          </select>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="pH" type="number" step="0.01" required />
          <label>pH</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="ABV" type="number" step="0.01" required />
          <label>ABV</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="bright" type="number" step="0.1" required />
          <label>Bright</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="pressure" type="number" step="0.01" required />
          <label>Pressure</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="generation" type="number" required />
          <label>Generation</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="volume" type="number" step="0.01" required />
          <label>Volume</label>
        </div>
        <div class="col-2 inputGroup">
          <input v-model="SG" type="number" step="0.000001" required />
          <label>Specific Gravity</label>
        </div>
        <div class="col-2 inputGroup">
          <input v-model="temp" type="number" step="0.1" required />
          <label>Temperature</label>
        </div>
        <div class="col-1 time inputGroup">
          <input v-model="time" type="datetime-local" />
          <label>Time Measured</label>
        </div>
        <div class="col-1 inputGroup">
          <input v-model="batch_name" required />
          <label>Batch Name</label>
        </div>
      </div>
      <button v-on:click="submit">Submit</button>
      <router-link to="/history" v-if="!mobile">
        <button type="button" name="button">Batch Histories</button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Tank, Action, Recipe } from '../types';
import { HttpResponse } from 'vue-resource/types/vue_resource';

// tslint:disable:no-any

interface IDataEntryState {
  SG?: any;
  tank_id?: number;
  tank_name?: string;
  status?: any;
  pH?: any;
  ABV?: any;
  temp?: any;
  volume?: any;
  generation?: any;
  recipe_id?: any;
  batch_id?: any;
  batch_name?: any;
  bright?: any;
  pressure?: any;
  action?: any;
  time?: any;
  recipes?: Recipe[];
  update?: any;
  mobile?: any;
  tanks?: Tank[];
  actions?: Action[];
  $http?: any;
  sortTanks?: any;
  debugging?: any;
}

export default Vue.extend({
  name: 'data-entry',
  data(): IDataEntryState {
    return {
      SG: '',
      status: '',
      pH: '',
      ABV: '',
      temp: '',
      volume: '',
      generation: '',
      recipe_id: '',
      batch_id: '',
      batch_name: '',
      bright: '',
      pressure: '',
      action: '',
      time: '',
      recipes: [],
      update: true,
      mobile: false,
      tanks: [],
      actions: []
    };
  },
  async beforeMount() {
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }
    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
    }

    try {
      const tanks: Tank[] = await this.$http.get(`${process.env.API}/tanks`).json();
      this.actions = await this.$http.get(`${process.env.API}/actions`);
      this.recipes = await this.$http.get(`${process.env.API}/recipes`);

      for (const tank of tanks) {
        if (
          tank.status !== 'broken' &&
          tank.status !== 'transferring' &&
          tank.status !== 'completed'
        ) {
          if (!this.tanks) this.tanks = [];
          this.tanks.push(tank);
        }
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    // tslint:disable-next-line:max-func-body-length
    async tankChoose() {
      // clear all our values each time we choose a new tank
      this.batch_id = '';
      this.batch_name = '';
      this.generation = '';
      this.volume = '';
      this.recipe_id = '';
      this.ABV = '';
      this.pH = '';
      this.temp = '';
      this.SG = '';
      this.bright = '';
      this.pressure = '';
      // set the time with the required dateime format eg "2018-05-10T15:08"
      this.time = moment().format('YYYY-MM-DDTHH:mm');

      try {
        const tank: Tank = await this.$http
          .get(`${process.env.API}/tanks/id/${this.tank_id}`)
          .json();
        // tslint:disable-next-line:no-any
        const batches: any[] = this.$http.get(`${process.env.API}/batches`).json();
        const { id, name } = tank;

        this.tank_id = id;
        this.tank_name = name;

        for (const batch of batches) {
          if (batch.tank_id === id) {
            // save batch_id, generation, volume, recipe_id
            this.batch_id = batch.id;
            this.batch_name = batch.batch_name;
            this.generation = batch.generation;
            this.volume = batch.volume;
            this.bright = batch.bright;
            this.recipe_id = batch.recipe_id;
          }
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
      // .then(
      //   tanksResponse => {
      //     this.tank_id = tanksResponse.body.id; //get tank database id
      //     this.tank_name = tanksResponse.body.tank_id; //get tank given name
      //     /********** query batches ********************/
      //     this.$http.get(process.env.API + '/batches').then(
      //       batchResponse => {
      //         /********** query batch_contents_versions ********************/
      //         this.$http.get(process.env.API + '/batch_contents_versions').then(
      //           batchContentsResponse => {
      //             // Iterate through batches information
      //             for (let batch of batchResponse.body) {
      //               //if our batch is in the specified tank
      //               if (batch.tank_id === this.tank_id) {
      //                 //save batch_id, generation, volume, recipe_id
      //                 this.batch_id = batch.id;
      //                 this.batch_name = batch.batch_name;
      //                 this.generation = batch.generation;
      //                 this.volume = batch.volume;
      //                 this.bright = batch.bright;
      //                 this.recipe_id = batch.recipe_id;
      //               }
      //             }
      //             //check and see if we are pulling info, if we pulled nothing, its a new batch!
      //             this.update = true;
      //             if (this.batch_id === '') {
      //               this.update = false;
      //             }

      //             // our max date will hold the most recent batch date
      //             var maxDate = moment('1995-07-29');
      //             for (let batchHistory of batchContentsResponse.body) {
      //               // if this the batchID that we are looking for and the time is more recent
      //               if (
      //                 batchHistory.batch_id === this.batch_id &&
      //                 moment(batchHistory.updated_at) > maxDate
      //               ) {
      //                 // set our new max date
      //                 maxDate = moment(batchHistory.updated_at);
      //                 this.ABV = batchHistory.ABV;
      //                 this.pH = batchHistory.pH;
      //                 this.temp = batchHistory.temp;
      //                 this.pressure = batchHistory.pressure;
      //                 this.SG = batchHistory.SG;
      //               }
      //             }
      //           },
      //           batchContentsResponse => {
      //             this.debugging =
      //               'Debugging Flag: Response error, cant access batches contents page';
      //           }
      //         );
      //         /*****************************************/
      //       },
      //       batchResponse => {
      //         this.debugging = 'Debugging Flag: Response error, cant access batches page';
      //       }
      //     );
      //     /*****************************************/
      //   },
      //   tanksResponse => {
      //     this.debugging = 'Debugging Flag: Response error, cant access tanks page';
      //   }
      // );
    },
    // tslint:disable-next-line:max-func-body-length
    async submit() {
      // this is where all the http requests will be monitored
      // when they are all fufilled, then send the user over to the
      // submision page.
      const promiseArray: any = [];

      // create a new batch data element
      const batchesData = {
        recipe_id: this.recipe_id,
        tank_id: this.tank_id,
        volume: this.volume,
        bright: this.bright,
        generation: this.generation,
        batch_name: this.batch_name
      };

      // We have two different paths we can take. Either the batch already
      // exists and we are just adding a new data point in the history,
      // or we are creating a new batch and all it's associated information

      // if we are updating, we don't need to know any information about each
      // process unless it failed. So we can put this all in a promise array
      // and fufil them one by one.

      // if we are making new stuff, we need to get information back from the
      // data base before we continue. As such, it is best that we do a promise
      // chain where we can pass information from the response of one event
      // into the next event.

      let id;

      // if we are going to make a new batch element
      if (!this.update) {
        // create a new batch element
        try {
          const { body } = await this.$http.post(`${process.env.API}/batches`, batchesData);
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
        }
        this.$http
          .post(`${process.env.API}/batches`, batchesData)
          .then(success => {
            // set our id to the id of the batch that we are getting back
            id = success.body.id;
          })
          .then(success => {
            // post the batch history
            const batchHistory = new FormData();
            batchHistory.append('batch_id', id);
            batchHistory.append('pH', this.pH);
            batchHistory.append('ABV', this.ABV);
            batchHistory.append('pressure', this.pressure);
            batchHistory.append('temp', this.temp);
            batchHistory.append('SG', this.SG);

            // create a new batch history point
            this.$http
              .post(`${process.env.API}/batch_contents_versions`, batchHistory)
              .then(success => {
                // tslint:disable-next-line:no-console
                console.log(success);
              })
              .catch(error => {
                console.warn(error);
              });

            const taskData = new FormData();
            // if the user wants to set an action
            if (this.action !== '') {
              taskData.append('action_id', this.action);
              taskData.append('batch_id', id);
              // create our new task
              this.$http.post(`${process.env.API}/tasks`, taskData).catch(error => {
                console.warn(error);
              });
            }
          })
          .then(success => {
            router.push({});
          })
          .catch(error => {
            console.warn(error);
          });
      } else {
        // patch the contents on that batch
        promiseArray.push(
          this.$http.patch(`${process.env.API}/batches/${this.batch_id}`, batchesData)
        );
        // change the id to the batchID
        id = this.batch_id;

        // post the batch history
        const batchHistory = new FormData();
        batchHistory.append('batch_id', id);
        batchHistory.append('pH', this.pH);
        batchHistory.append('ABV', this.ABV);
        batchHistory.append('pressure', this.pressure);
        batchHistory.append('temp', this.temp);
        batchHistory.append('SG', this.SG);

        // create a new batch history point
        promiseArray.push(
          this.$http.post(`${process.env.API}/batch_contents_versions`, batchHistory)
        );

        const taskData = new FormData();
        // if the user wants to set an action
        if (this.action !== '') {
          taskData.append('action_id', this.action);
          taskData.append('batch_id', id);
          // create our new task
          promiseArray.push(this.$http.post(`${process.env.API}/tasks`, taskData));
        }

        Promise.all(promiseArray)
          .then(success => {
            router.push({});
          })
          .catch(error => {
            console.warn(error);
          });
      }
    },
    sortTanks(a, b) {
      return a.id - b.id;
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#dataEntry
  padding 15px
  grid-area entry
  display flex
  flex-direction column
  align-items center
  +less-than(tablet)
    width 90vw
  margin auto
  min-width 350px
  max-width 500px
  button
    margin-top 30px

  #formFields
    .time
      display block
    text-align center
</style>
