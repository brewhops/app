<template>
  <div>
    <div class="header" v-if="mobile">
      <router-link to="/home-mobile">Home</router-link>
      <h2>Data Entry</h2>
    </div>
    <div id="dataEntry">
      <h2 v-if="!mobile">Data Entry</h2>
      <span id="batchName">
        <h4>Batch:</h4>
        {{ batch_name }}
      </span>
      <div id="formFields" class="grid">
        <div class="col-3">
          <span>
            <h4>Tank</h4>
            {{ tank.name }}
          </span>
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
          {{ recipe_name }}
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
      </div>
      <button v-on:click="submit">Submit</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';
import moment from 'moment';
import {
  Tank,
  Action,
  ActionUpdate,
  Recipe,
  Batch,
  Version,
  Task,
  BrewhopsCookie,
  BatchUpdateOrCreate
} from '../types';
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
  recipe_name?: any;
  recipe_id?: any;
  batch_id?: any;
  batch_name?: any;
  bright?: any;
  pressure?: any;
  action: number | string;
  time?: any;
  recipe?: Recipe;
  update?: any;
  mobile?: any;
  tank?: Tank;
  actions?: Action[];
  tasks?: Task[];
  sortTanks?: any;
  debugging?: any;
  prevActionId?: number;
}

export default Vue.extend({
  name: 'data-entry',
  props: {
    tank_id: {
      type: Number,
      required: true
    }
  },
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
      recipe_name: '',
      batch_name: '',
      bright: '',
      pressure: '',
      action: '',
      time: '',
      update: true,
      mobile: false,
      tank: {
        id: -1,
        name: '',
        status: '',
        in_use: false
      },
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
      const tankResponse: HttpResponse = await this.$http.get(
        `${process.env.API}/tanks/id/${this.tank_id}`
      );
      const tank: Tank = tankResponse.data;

      const actionsResponse: HttpResponse = await this.$http.get(`${process.env.API}/actions`);
      const actions: Action[] = actionsResponse.data;

      this.tank = tank;
      this.actions = actions;

      this.tankChoose();
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
            this.batch_name = batch.name;
            this.generation = batch.generation;
            this.volume = batch.volume;
            this.bright = batch.bright;
            this.recipe_id = batch.recipe_id;
            this.prevActionId = actionID;

            // Get the recipe name
            const recipeResponse: HttpResponse = await this.$http.get(
              `${process.env.API}/recipes/id/${this.recipe_id}`
            );
            const recipe: Recipe = recipeResponse.data;
            this.recipe_name = recipe.name;

            break;
          }
        }
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    },
    // tslint:disable-next-line:max-func-body-length
    async submit() {
      const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');

      const requestObject: BatchUpdateOrCreate = {
        recipe_id: this.recipe_id,
        tank_id: this.tank_id,
        volume: this.volume,
        bright: this.bright,
        generation: this.generation,
        name: this.batch_name,
        ph: this.pH,
        abv: this.ABV,
        pressure: this.pressure,
        temperature: this.temp,
        sg: this.SG,
        action: {
          id: this.action,
          completed: this.prevActionId !== this.action ? true : false,
          assigned: false,
          employee: {
            id: cookie.id
          }
        }
      };

      console.log(JSON.stringify(requestObject));

      try {
        const response = await this.$http.post(`${process.env.API}/batches`, requestObject);
      } catch (err) {
        console.error(err);
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

#batchName
  text-align center

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
