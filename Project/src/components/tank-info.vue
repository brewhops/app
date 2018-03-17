<template>
<div>
  <div class="header">
    <router-link v-bind:to="home">home</router-link>
    <h2>Tank Data</h2>
  </div>
  <div id="content">
    <div id="data">
      <h2>Brand History</h2>
      <div id="charts">
        <temp-chart></temp-chart>
        <abv-chart></abv-chart>
        <sg-chart></sg-chart>
        <ph-chart></ph-chart>
      </div>
    </div>
    <div id="tank">
      <h2>Tank ID</h2>
      <h3>8439-4389</h3>
      <table>
        <tr>
          <td>Status</td>
          <td>OK</td>
        </tr>
        <tr>
          <td>Brand ID</td>
          <td>Pacific Rain</td>
        </tr>
        <tr>
          <td>Batch Number</td>
          <td>3289-2389</td>
        </tr>
        <tr>
          <td>Generation</td>
          <td>3</td>
        </tr>
        <tr>
          <td>Volume</td>
          <td>182.3</td>
        </tr>
        <tr>
          <td>Temperature</td>
          <td>70º F</td>
        </tr>
        <tr>
          <td>Specific Gravity</td>
          <td>3.4</td>
        </tr>
        <tr>
          <td>pH</td>
          <td>4.4</td>
        </tr>
        <tr>
          <td>ABV</td>
          <td>8%</td>
        </tr>
        <tr>
          <td>Time Last Updated</td>
          <td>2017-18-02 14:24</td>
        </tr>
      </table>
      <button>I'm On It</button>
      <router-link v-bind:to="doneLink"><button type="button" name="button">Add Data</button> </router-link>
      <router-link to="/recipe" v-if="mobile"><button type="button" name="button">Recipe</button></router-link>
    </div>
    <recipe v-if="!mobile"></recipe>
  </div>
</div>
</template>

<script>

import recipe from './recipe.vue'
import tempChart from './charts/temp.vue'
import abvChart from './charts/abv.vue'
import sgChart from './charts/specificGravity.vue'
import phChart from './charts/ph.vue'

export
default {
  name: 'tank-info',
  components: {
    'recipe': recipe,
    'temp-chart': tempChart,
    'abv-chart': abvChart,
    'sg-chart': sgChart,
    'ph-chart': phChart,
  },
  data() {
    return {
      tankInfo: [{
       "id" : 1,
       "recipe_id" : 'Pacific Rain',
       "tank_id" : 2,
       "volume": 20.0,
       "bright": 15.0,
       "generation" : 10.0,
       "sG" : 25.0,
       "pH" :5.5,
       "aBV": 5.5,
       "temp": 45,
       "status": 'ok',

     }],
      doneLink: '',
      home: '',
      mobile: false
    };
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
      this.doneLink = '/data-entry'
      this.home = '/home-mobile'
    } else {
      this.doneLink = '/home'
      this.home = '/home'
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'


#content
  display grid
  grid-template-columns auto 400px

  grid-template-areas "data tank" "data recipe"
  width 100vw

  +less-than(tablet)
    align-items flex-start

  +less-than(mobile)
    grid-template-columns 98vw
    grid-template-areas "tank" "recipe"

#data
  +less-than(mobile)
    display none
  grid-area data
  #charts
    display grid
    grid-template-columns repeat(2, 30vw)
    +less-than(tablet)
      grid-template-columns auto
  h2
    text-align center


#tank
  text-align center
  table
    text-align left
    margin auto
  h2, h3, h4
    text-align center
  grid-area tank
</style>
