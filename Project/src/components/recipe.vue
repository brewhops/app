<template>
  <div>
    <div class="header" v-if="mobile">
       <router-link to="/home-mobile">Home</router-link>
      <h2>Recipe</h2>
    </div>
  <div id="recipe">
    <h2>{{name}}</h2>
    <table>
      <tr v-for="(ingredient, ratio) in ingredients">
        <td>{{ingredient}}</td>
        <td>{{ratio}}</td>
      </tr>
    </table>
    <router-link to="/tank-info" v-if="mobile">
      <button type="button" name="button">Back to Tank</button>
    </router-link>
  </div>
</div>
</template>

<script>

import router from "../router/index.js"
import Cookie from "js-cookie"

export default {
  name: 'recipe',
  props: ['recipeID'],
  data() {
    return {
      mobile: false,
      name: '',
      ingredients: {}
    };
  },
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.get('loggedIn')) {
        router.push("/")
    }

    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }

    const base = 'https://ninkasi-server.herokuapp.com'
    this.$http.get(base + '/recipes/' + this.recipeID).then(recipeResponse => {
      const recipe = recipeResponse.body
      this.name = recipe.recipe_name
      this.ingredients = JSON.parse(recipe.instructions)
    }).then(error => {
      console.warn("Failed to get recipe", error)
    })
  }
};
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
