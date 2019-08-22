<template>
  <div v-if="this.tank">
    <h2>Create new batch</h2>
    <form id="create-new-batch" @submit.prevent="createBatch">
      <div class="grid">
        <div class="col-1 inputGroup">
          <h4>Batch Name</h4>
          <input v-model="batch_name" type="string" placeholder="Name" />
          <span>{{ feedback.name }}</span>
        </div>
        <div class="col-1">
          <h4>Recipe</h4>
          <select v-model="recipe_id">
            <option value="">Select a Recipe</option>
            <option v-for="recipe in recipes" v-bind:key="recipe.id" v-bind:value="recipe.id">
              {{ recipe.name }}
            </option>
          </select>
          <span>{{ feedback.recipe }}</span>
        </div>
        <div class="col-1 inputGroup">
          <h4>Volume</h4>
          <input v-model="volume" type="number" step="0.01" required />
          <label>Volume</label>
          <span>{{ feedback.generation }}</span>
        </div>
        <div class="col-1 inputGroup">
          <h4>Yeast Generation</h4>
          <input v-model="generation" type="number" step="1" required />
          <label>Yeast Generation</label>
        </div>
        <span>{{ feedback.generation }}</span>
      </div>
      <span>{{ feedback.status }}</span>
      <button>Submit</button>
    </form>
  </div>
  <loader v-else></loader>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { isMoment } from 'moment';
import router from '@/router';
import Cookie from 'js-cookie';
import loader from '../loader.vue';
import { Recipe, Batch, Tank, Task } from '@/types/index';
import { TANK_STATUS, ACTION } from '@/utils';
import { HttpOptions } from 'vue-resource/types/vue_resource';

interface INewBatchState {
  recipes: Recipe[];
  recipe_id: string;
  batch_name: string;
  volume: string;
  generation: string;
  feedback: {
    status: string;
    batch_name: string;
    recipe: string;
    volume: string;
    generation: string;
  };
}

export default Vue.extend({
  name: 'new-batch',
  components: { loader },
  props: {
    tank: {
      type: Object,
      required: true
    }
  },
  data(): INewBatchState {
    return {
      recipes: [],
      recipe_id: '',
      batch_name: '',
      volume: '',
      generation: '',
      feedback: {
        status: '',
        batch_name: '',
        recipe: '',
        volume: '',
        generation: ''
      }
    };
  },
  async beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    try {
      const recipeResponse = await this.$http.get(`${process.env.VUE_APP_API}/recipes/`);
      this.recipes = <Recipe[]>recipeResponse.data;
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    async createBatch(e: any) {
      if (
        this.tank.status === TANK_STATUS.AVAILABLE &&
        this.recipe_id &&
        this.batch_name &&
        this.volume &&
        this.generation
      ) {
        const employeeId: number = Cookie.getJSON('id');
        const batch: Batch = {
          name: this.batch_name,
          generation: parseInt(this.generation, 10),
          volume: parseInt(this.volume, 10),
          bright: 0,
          recipe_id: parseInt(this.recipe_id, 10),
          tank_id: this.tank.id
        };

        const headers = {
          Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
        };

        try {
          const batchResponse = await this.$http.post(
            `${process.env.VUE_APP_API}/batches/new/`,
            batch,
            {
              headers
            }
          );
          await this.updateTank(employeeId, headers);
          await this.createInitialTask(employeeId);
          router.push('/');
        } catch (err) {
          console.error(err);
        }
      } else {
        if (!this.recipe_id) {
          this.feedback.recipe = 'Select a recipe.';
        }
        if (!this.batch_name) {
          this.feedback.batch_name = 'Enter a name for the batch';
        }
        if (!this.volume) {
          this.feedback.volume = 'Enter the volume of the batch';
        }
        if (!this.generation) {
          this.feedback.generation = 'Enter the yeast generation of the batch';
        }
        if (this.tank.status !== TANK_STATUS.AVAILABLE) {
          this.feedback.status = `Unable to create batch. Tank status: ${this.tank.status}`;
        }
      }
    },
    async createInitialTask(employee_id: number) {
      try {
        const batchResponse = await this.$http.get(`${process.env.VUE_APP_API}/batches/`);
        const batches = batchResponse.data.filter((batch: Batch) => batch.name === this.batch_name);

        const task: Task = {
          employee_id,
          batch_id: batches[0].id,
          action_id: ACTION.PRIMARY_FERMENTATION,
          added_on: new Date().toUTCString()
        };
        const taskResponse = await this.$http.post(`${process.env.VUE_APP_API}/tasks/`, task);
      } catch (err) {
        console.log(err);
      }
    },
    // tslint:disable-next-line:no-any
    async updateTank(employeeId: number, headers: any) {
      const { id, ...tank } = this.tank;
      tank.in_use = true;
      tank.update_user = employeeId;
      tank.status = TANK_STATUS.BREWING;

      try {
        const tankResponse = await this.$http.patch(
          `${process.env.VUE_APP_API}/tanks/id/${id}/`,
          tank,
          {
            headers
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../../styles/breakpoints'

#create-new-batch
  padding 15px
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center
  width: 70vw
  +less-than(tablet)
    width 90vw
  button
    margin-top 30px

h2, h3, h4
  text-align center
</style>
