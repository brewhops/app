<template>
  <div>
    <form class="dataEntry" @submit.prevent="submit">
      <h2>Data Entry</h2>
      <div class="formFields grid">
        <div class="col-3 inputGroup">
          <input v-model="pH" type="number" step="0.01" required />
          <label>pH</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="ABV" type="number" step="0.01" required />
          <label>ABV</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="pressure" type="number" step="0.01" required />
          <label>Pressure</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="SG" type="number" step="0.000001" required />
          <label>Specific Gravity</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="temp" type="number" step="0.1" required />
          <label>Temperature</label>
        </div>
        <div class="col-3 time inputGroup">
          <datepicker placeholder="Select Date" v-model="time"></datepicker>
          <!-- <input v-model="time" type="datetime-local" /> -->
          <!-- <label>Time Measured</label> -->
        </div>
      </div>
      <button>Submit</button>
    </form>
    <form class="dataEntry" v-if="admin" @submit.prevent="completeBatch">
      <button class="col-2">Complete Batch</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '@/router';
import Cookie from 'js-cookie';
import moment, { unix } from 'moment';
import Datepicker from 'vuejs-datepicker';
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
} from '@/types/index';
import { HttpResponse } from 'vue-resource/types/vue_resource';
import { TANK_STATUS } from '../../utils/index';

// tslint:disable:no-any no-console
interface IDataEntryState {
  pH: string;
  ABV: string;
  bright: string;
  pressure: string;
  SG: string;
  temp: string;
  time: string;
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
      required: true
    },
    batch: {
      type: Object,
      required: true
    },
    recipe: {
      type: Object,
      required: true
    },
    activeTask: {
      type: Object,
      required: false,
      default: undefined
    }
  },
  components: {
    Datepicker
  },
  data(): IDataEntryState {
    return {
      pH: '',
      ABV: '',
      bright: '',
      pressure: '',
      SG: '',
      temp: '',
      time: '',

      update: true,
      admin: false
    };
  },
  async beforeMount() {
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }
    this.admin = Cookie.getJSON('loggedIn').admin;

    // set the time with the required dateime format eg "2018-05-10T15:08"
    this.time = moment().format('YYYY-MM-DDTHH:mm');
  },
  methods: {
    async reset() {
      this.pH = '';
      this.ABV = '';
      this.pressure = '';
      this.SG = '';
      this.temp = '';
    },
    async readAlcolyzerData(event: any) {
      event.preventDefault();
      const reader = new FileReader();
      const file = event.target.files[0];

      reader.onload = () => {
        if (reader.result) {
          const strs = (reader.result as string).split('\n');
          while (!strs.slice(-1)[0]) strs.pop();
          [, this.time, , , , this.pH, this.SG, this.ABV] = strs.slice(-1)[0].split(',');
        }
      };

      if (file.type !== 'text/csv') alert('File type not supported');
      else reader.readAsText(file);
    },
    // tslint:disable-next-line:max-func-body-length
    async submit(event: any) {
      const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');
      const headers = {
        Authorization: `Bearer ${cookie.token}`
      };

      const requestObject: BatchUpdateOrCreate = {
        recipe_id: Number(this.recipe.id),
        tank_id: Number(this.tank.id),
        batch_id: Number(this.batch.id),
        volume: Number(this.batch.volume),
        bright: Number(this.batch.bright),
        generation: Number(this.batch.generation),
        name: this.batch.name,
        ph: Number(this.pH),
        abv: Number(this.ABV),
        pressure: Number(this.pressure),
        temperature: Number(this.temp),
        sg: Number(this.SG),
        measured_on: moment(this.time).toISOString(),
        update_user: Number(cookie.id)
      };

      try {
        const response = await this.$http.post(
          `${process.env.VUE_APP_API}/batches/update`,
          requestObject,
          {
            headers
          }
        );
        this.$emit('newDataCallback');
        this.reset();
        event.target.reset();
      } catch (err) {
        console.error(err);
      }
    },
    async completeBatch(event: any) {
      event.preventDefault();

      if (this.admin) {
        const cookie: BrewhopsCookie = Cookie.getJSON('loggedIn');
        const headers = {
          Authorization: `Bearer ${cookie.token}`
        };

        const confirmation = confirm('Are you sure you want to close the batch?');
        if (confirmation) {
          try {
            await this.$http.delete(`${process.env.VUE_APP_API}/batches/close/${this.batch.id}`, {
              headers
            });

            const { id, ...tank } = this.tank;
            tank.status = TANK_STATUS.AVAILABLE;
            tank.in_use = false;
            tank.update_user = cookie.id;
            await this.$http.patch(`${process.env.VUE_APP_API}/tanks/id/${this.tank.id}`, tank, {
              headers
            });

            if (this.activeTask) {
              const task: Task = this.activeTask;
              task.completed_on = moment().toISOString();
              task.update_user = Number(cookie.id);
              const response = await this.$http.patch(`${process.env.VUE_APP_API}/tasks/`, task, {
                headers
              });
            }

            router.push('/');
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../../styles/breakpoints'

#actionSelect
  text-align center
  margin-bottom 20px

.dataEntry
  padding 15px
  grid-area entry
  display flex
  flex-direction column
  align-items center
  max-width 500px
  button
    margin-top 30px

  .formFields
    .time
      display block
    text-align center
</style>
