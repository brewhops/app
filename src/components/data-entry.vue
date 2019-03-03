<template>
  <div>
    <form id="dataEntry" @submit.prevent="submit">
      <h2>Data Entry</h2>
      <span id="actionSelect">
        <h4>Action</h4>
        <select v-model="action">
          <option value="">Select an Action</option>
          <option
            v-for="action_option in model.actions"
            v-bind:key="action_option.id"
            v-bind:value="action_option.id"
          >
            {{ action_option.name }}</option
          >
        </select>
      </span>
      <div id="formFields" class="grid">
        <div class="col-3">
          <span>
            <h4>Tank</h4>
            {{ this.tank.name }}
          </span>
        </div>
        <div class="col-3">
          <h4>Batch</h4>
          {{ model.batch_name }}
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
      <button v-if="admin" v-on:click="completeBatch">Complete Batch</button>
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
import { TANK_STATUS } from '../utils/index';

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
  admin: boolean;
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
      admin: false
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
    this.admin = Cookie.getJSON('loggedIn').admin;

    // set the time with the required dateime format eg "2018-05-10T15:08"
    this.time = moment().format('YYYY-MM-DDTHH:mm');

    try {
      const headers = {
        Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
      };
      const actionsResponse: HttpResponse = await this.$http.get(
        `${process.env.API}/actions`,
        headers
      );
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
      const headers = {
        Authorization: `Bearer ${cookie.token}`
      };

      if (this.activeTask && this.activeTask.action_id !== this.action) {
        const task: Task = this.activeTask;
        task.completed_on = moment().toISOString();
        try {
          const response = await this.$http.patch(`${process.env.API}/tasks`, task, {
            headers: headers
          });
        } catch (err) {
          console.error(err);
        }
      }

      if ((!this.activeTask || this.activeTask.action_id !== this.action) && this.action) {
        const task: Task = {
          added_on: moment().toISOString(),
          assigned: true,
          batch_id: this.batch!.id,
          action_id: Number(this.action),
          employee_id: Number(cookie.id)
        };

        try {
          const response = await this.$http.post(`${process.env.API}/tasks`, task, {
            headers: headers
          });
        } catch (err) {
          console.error(err);
        }
      }

      const requestObject: BatchUpdateOrCreate = {
        recipe_id: Number(this.recipe!.id),
        tank_id: Number(this.tank!.id),
        batch_id: Number(this.batch!.id),
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
        update_user: Number(cookie.id)
      };

      try {
        const response = await this.$http.post(`${process.env.API}/batches/update`, requestObject, {
          headers: headers
        });
        this.$emit('newDataCallback');
        this.reset();
        event.target.reset();
      } catch (err) {
        console.error(err);
      }
    },
    async completeBatch(event) {
      event.preventDefault();

      if (this.admin) {
        const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');
        const headers = {
          Authorization: `Bearer ${cookie.token}`
        };

        const confirmation = confirm('Are you sure you want to close the batch?');
        if (confirmation) {
          await this.$http.delete(`${process.env.API}/batches/close/${this.batch!.id}`, {
            headers: headers
          });

          const { id, ...tank } = this.tank;
          tank.status = TANK_STATUS.AVAILABLE;
          tank.in_use = false;
          tank.update_user = cookie.id;
          await this.$http.patch(`${process.env.API}/tanks/id/${this.tank!.id}`, tank, {
            headers: headers
          });

          if (this.activeTask) {
            const task: Task = this.activeTask;
            task.completed_on = moment().toISOString();
            task.update_user = Number(cookie.id);
            const response = await this.$http.patch(`${process.env.API}/tasks`, task, {
              headers: headers
            });
          }

          router.push('/');
        }
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#actionSelect
  text-align center
  margin-bottom 20px

#dataEntry
  padding 15px
  grid-area entry
  display flex
  flex-direction column
  align-items center
  max-width 500px
  button
    margin-top 30px

  #formFields
    .time
      display block
    text-align center
</style>
