<template>
  <div v-show="recipe" id="recipe">
    <h2>{{ this.recipe.name }}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Ingredient</th>
          <th>Ratio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in this.recipe.instructions" v-bind:key="item.ingredient">
          <td>{{ item.ingredient }}</td>
          <td>{{ item.ratio }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../../router/index.js';
import Cookie from 'js-cookie';

interface IRecipeState {
  mobile: boolean;
}

export default Vue.extend({
  name: 'recipe',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data(): IRecipeState {
    return {
      mobile: false
    };
  },
  beforeMount(): void {
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
  }
});
</script>

<style lang="stylus" scoped>
#recipe
  grid-area recipe
  text-align center
  table
    text-align left
    margin auto
    thead, tbody
      td, th
        padding-right 10px
        padding-left 10px
        padding-top 5px
        padding-bottom 5px
  h2, h3, h4
    text-align center
</style>
