<template>
  <div>
    <div class="header" v-if="mobile">
      <router-link to="/home-mobile">Home</router-link>
      <h2>Data Entry</h2>
    </div>
    <form id="dataEntry" @submit.prevent="submit">
      <h2 v-if="!mobile">Data Entry</h2>
      <span id="batchName">
        <h4>Batch:</h4>
        {{ model.batch_name }}
      </span>
      <div id="formFields" class="grid">
        <div class="col-3">
          <span>
            <h4>Tank</h4>
            {{ model.tank_name }}
          </span>
        </div>
        <div class="col-3">
          <h4>Action</h4>
          <select v-model="action">
            <option value="">No Action</option>
            <option
              v-for="action_option in model.actions"
              v-bind:key="action_option.id"
              v-bind:value="action_option.id"
            >
              {{ action_option.name }}</option
            >
          </select>
        </div>
        <div class="col-3">
          <h4>Recipe</h4>
          {{ model.recipe_name }}
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
      <button>Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';
import moment, { unix } from 'moment';
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

interface IDataEntryViewModel {
  tank_name: string;
  recipe_name: string;
  batch_name: string;
  actions: Action[];
}

// tslint:disable:no-any no-console
interface IDataEntryState {
  model: IDataEntryViewModel;

  pH: string;
  ABV: string;
  bright: string;
  pressure: string;
  generation: string;
  volume: string;
  SG: string;
  temp: string;
  time: string;
  action: number | string;

  update?: any;
  mobile?: any;
  sortTanks?: any;
  debugging?: any;
}

export default Vue.extend({
  name: 'data-entry',
  props: {
    tank: {
      type: Object,
      required: false
    },
    batch: {
      type: Object,
      required: false
    },
    recipe: {
      type: Object,
      required: false
    },
    activeTask: {
      type: Object,
      required: false,
      default: undefined
    }
  },
  data(): IDataEntryState {
    return {
      model: {
        tank_name: '',
        recipe_name: '',
        batch_name: '',
        actions: []
      },

      pH: '',
      ABV: '',
      bright: '',
      pressure: '',
      generation: '',
      volume: '',
      SG: '',
      temp: '',
      time: '',
      action: '',

      update: true,
      mobile: false
    };
  },
  watch: {
    tank() {
      this.model = {
        ...this.model,
        tank_name: this.tank!.name
      };
    },
    recipe() {
      this.model = {
        ...this.model,
        recipe_name: this.recipe!.name
      };
    },
    batch() {
      this.model = {
        ...this.model,
        batch_name: this.batch!.name
      };

      this.generation = this.batch!.generation.toString();
      this.volume = this.batch!.volume.toFixed(2);
      this.bright = this.batch!.bright.toFixed(1);
    }
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

    // set the time with the required dateime format eg "2018-05-10T15:08"
    this.time = moment().format('YYYY-MM-DDTHH:mm');

    try {
      const actionsResponse: HttpResponse = await this.$http.get(`${process.env.API}/actions`);
      const actions: Action[] = actionsResponse.data;

      this.model = {
        ...this.model,
        actions
      };
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    async reset() {
      this.pH = '';
      this.ABV = '';
      this.bright = '';
      this.pressure = '';
      this.generation = '';
      this.volume = '';
      this.SG = '';
      this.temp = '';
      this.action = '';
    },
    // tslint:disable-next-line:max-func-body-length
    async submit(event) {
      const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');

      if (this.activeTask && this.activeTask.action_id !== this.action) {
        const task: Task = this.activeTask;
        task.completed_on = moment().toISOString();
        try {
          const response = await this.$http.patch(`${process.env.API}/tasks`, task);
        } catch (err) {
          console.error(err);
        }
      }

      const requestObject: BatchUpdateOrCreate = {
        recipe_id: Number(this.recipe!.id),
        tank_id: Number(this.tank!.id),
        volume: Number(this.volume),
        bright: Number(this.bright),
        generation: Number(this.generation),
        name: this.batch!.name,
        ph: Number(this.pH),
        abv: Number(this.ABV),
        pressure: Number(this.pressure),
        temperature: Number(this.temp),
        sg: Number(this.SG),
        measured_on: moment(this.time).toISOString(),
        action: {
          id: this.action,
          completed: false,
          assigned: false,
          employee: {
            id: cookie.id
          }
        }
      };

      try {
        const response = await this.$http.post(`${process.env.API}/batches`, requestObject);
        this.$emit('newDataCallback');
        this.reset();
        event.target.reset();
      } catch (err) {
        console.error(err);
      }
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
