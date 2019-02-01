<template>
  <div id="recipe">
    <h2>{{ name }}</h2>
    <table>
      <tr v-for="(ratio, ingredient) in ingredients" v-bind:key="ingredient">
        <td>{{ ingredient }}</td>
        <td>{{ ratio }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';

interface IRecipeState {
  name: string;
  mobile: boolean;
  ingredients: object;
}

export default Vue.extend({
  name: 'recipe',
  props: ['recipeID'],
  data(): IRecipeState {
    return {
      mobile: false,
      name: '',
      ingredients: {}
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
  },
  watch: {
    // tslint:disable-next-line:object-literal-shorthand
    async recipeID() {
      if (this.recipeID) {
        try {
          const response = await this.$http.get(`${process.env.API}/recipes/id/${this.recipeID}`);
          const { recipe_name, instructions } = response.data;
          this.name = recipe_name;
          this.ingredients = JSON.parse(instructions);
        } catch (err) {
          console.warn('Failed to get recipe', err);
        }
      }
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
  h2, h3, h4
    text-align center

table
  td
    padding 5px
</style>
