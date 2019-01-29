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
              tank.id
            }}</option>
          </select>
        </div>
        <div class="col-3">
          <h4>Action</h4>
          <select v-model="action">
            <option value="">No Action</option>
            <option
              v-for="action_option in actions"
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
import { Tank, Action, Recipe, Batch, Version, Task, BrewhopsCookie } from '../types';
import { HttpResponse } from 'vue-resource/types/vue_resource';

// tslint:disable:no-any no-console

interface IDataEntryState {
  SG?: any;
  tank_id?: string;
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
  tasks?: Task[];
  sortTanks?: any;
  debugging?: any;
  prevActionId?: number;
}

export default Vue.extend({
  name: 'data-entry',
  data(): IDataEntryState {
    return {
      tank_id: '',
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
      actions: [],
      tasks: []
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
      const tanksResponse: HttpResponse = await this.$http.get(`${process.env.API}/tanks`);
      const actionsResponse: HttpResponse = await this.$http.get(`${process.env.API}/actions`);
      const recipesResponse: HttpResponse = await this.$http.get(`${process.env.API}/recipes`);
      const tasksResponse: HttpResponse = await this.$http.get(`${process.env.API}/tasks`);
      const tanks: Tank[] = tanksResponse.data;
      const actions: Action[] = actionsResponse.data;
      const recipes: Recipe[] = recipesResponse.data;
      const tasks: Task[] = tasksResponse.data;
      this.actions = actions;
      this.recipes = recipes;
      this.tasks = tasks;

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
        const tankResponse = await this.$http.get(`${process.env.API}/tanks/id/${this.tank_id}`);
        // tslint:disable-next-line:no-any
        const batchResponse = await this.$http.get(`${process.env.API}/batches`);
        const batches: any[] = batchResponse.data;
        const { id, name } = tankResponse.data;

        this.tank_id = id;
        this.tank_name = name;

        for (const batch of batches) {
          if (batch.tank_id === id) {
            let actionID;
            // find the current action id
            if (this.tasks) {
              this.tasks.forEach((task: Task) => {
                if (task.batch_id === batch.id) {
                  actionID = task.action_id;
                }
              });
            }
            // save batch_id, generation, volume, recipe_id
            this.batch_id = batch.id;
            this.batch_name = batch.batch_name;
            this.generation = batch.generation;
            this.volume = batch.volume;
            this.bright = batch.bright;
            this.recipe_id = batch.recipe_id;
            this.prevActionId = actionID;
          }
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    },
    // tslint:disable-next-line:max-func-body-length
    async submit() {
      // this is where all the http requests will be monitored
      // when they are all fufilled, then send the user over to the
      // submission page.
      const promiseArray: any = [];

      // create a new batch data element
      const batch: Batch = {
        recipe_id: this.recipe_id,
        tank_id: this.tank_id,
        volume: this.volume,
        bright: this.bright,
        generation: this.generation,
        name: this.batch_name
      };

      // create a new batch history point (version)
      const version: Version = {
        ph: this.pH,
        abv: this.ABV,
        pressure: this.pressure,
        temperature: this.temp,
        sg: this.SG
      };

      const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');

      console.log(cookie);

      const requestObject = {
        ...batch,
        ...version,
        action: {
          id: this.action,
          completed: this.prevActionId !== this.action,
          assigned: false,
          employee: {
            id: cookie.id
          }
        }
      };

      console.log(requestObject);

      try {
        const response = await this.$http.post(`${process.env.API}/batches`, requestObject);
      } catch (err) {
        console.error(err);
      }

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

      // let id;

      // if we are going to make a new batch element
      // if (!this.update) {
      //   // create a new batch element
      //   try {
      //     const { body } = await this.$http.post(`${process.env.API}/batches`, batch);
      //   } catch (err) {
      //     console.error(err);
      //   }

      //   try {
      //     const response = this.$http.post(`${process.env.API}/batches`, batch);
      //     // set our id to the id of the batch that we are getting back
      //     id = response.data.id;
      //   } catch (err) {
      //     console.error(err);
      //   }

      //   // create a new batch history point (version)
      //   const version: Version = {
      //     batch_id: id,
      //     ph: this.pH,
      //     abv: this.ABV,
      //     pressure: this.pressure,
      //     temperature: this.temp,
      //     sg: this.SG
      //   };

      //   try {
      //     // post the batch history (version)
      //     const response = this.$http.post(`${process.env.API}/versions/`, version);
      //     console.log(response.data);
      //   } catch (err) {
      //     console.error(err);
      //   }

      //   // if the user wants to set an action
      //   if (this.action !== '') {
      //     const task: Task = {
      //       batch_id: id,
      //       action_id: this.action
      //     };
      //     try {
      //       // create our new task
      //       this.$http.post(`${process.env.API}/tasks`, task);
      //       router.push({});
      //     } catch (err) {
      //       console.error(err);
      //     }
      //   }
      // } else {
      //   // patch the contents on that batch
      //   promiseArray.push(this.$http.patch(`${process.env.API}/batches/${this.batch_id}`, batch));
      //   // change the id to the batchID
      //   id = this.batch_id;

      //   // post the batch history
      //   const version: Version = {
      //     batch_id: id,
      //     ph: this.pH,
      //     abv: this.ABV,
      //     pressure: this.pressure,
      //     temperature: this.temp,
      //     sg: this.SG
      //   };

      //   // create a new batch history point
      //   promiseArray.push(this.$http.post(`${process.env.API}/versions`, version));

      //   // if the user wants to set an action
      //   if (this.action !== '') {
      //     const task: Task = {
      //       batch_id: id,
      //       action_id: this.action
      //     };
      //     // create our new task
      //     promiseArray.push(this.$http.post(`${process.env.API}/tasks`, task));
      //   }

      //   Promise.all(promiseArray)
      //     .then(success => {
      //       router.push({});
      //     })
      //     .catch(error => {
      //       console.warn(error);
      //     });
      // }
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
