<template>
  <div>
    <h2>Create new batch in tank {{ this.tank.name }}</h2>
    <form id="create-new-batch">
      <div class="grid">
        <div class="col-1 inputGroup">
          <h4>Batch Name</h4>
          <input v-model="batch_name" type="string" />
        </div>
        <div class="col-1">
          <h4>Recipe</h4>
          <select v-model="recipe_id">
            <option v-for="recipe in recipes" v-bind:key="recipe.id" v-bind:value="recipe.id">
              {{ recipe.name }}
            </option>
          </select>
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
import { Recipe } from '../types/index.js';

interface INewBatchState {
  recipes: Recipe[];
  recipe_id?: number;
  batch_name: string;
  mobile: boolean;
  feedback: {
    batch_name: string;
    recipe: string;
  };
}

export default Vue.extend({
  name: 'new-batch',
  props: ['tank'],
  data(): INewBatchState {
    return {
      recipes: [],
      batch_name: '',
      mobile: false,
      feedback: {
        batch_name: '',
        recipe: ''
      }
    };
  },
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
    }

    try {
      const recipeResponse = await this.$http.get(`${process.env.API}/recipes`);
      this.recipes = <Recipe[]>recipeResponse.data;
    } catch (err) {
      console.error(err);
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

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
