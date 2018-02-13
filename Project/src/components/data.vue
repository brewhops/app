<template>
<div>
  <div class="header">
    <router-link to="/home">home</router-link>
    <h2>Tank Data</h2>
  </div>
  <div id="content">
    <div id="data">
      <h2>Brand History</h2>
      <div id="charts">
        <div id="tempChart"></div>
        <div id="abvChart"></div>
        <div id="sgChart"></div>
        <div id="phChart"></div>
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
      <router-link to="/home"><button>Add Data</button></router-link>
    </div>
    <recipe></recipe>
  </div>
</div>
</template>

<script>

import recipe from './recipe.vue'

export default {
  name: 'data',
  components: {
    'recipe': recipe
  },
  data() {
    return {
      msg: '',
      tanks: [
        {
          tankNumber: 13223431,
          pressure: 15,
          beerID: 12725,
          temperature: 69,
          batchNumber: 1357,
          status: "cap"
        },
        {
          tankNumber: 14321432,
          pressure: 1,
          beerID: 1257,
          temperature: 69,
          batchNumber: 13575,
          status: "ok"
        },
        {
          tankNumber: 15433,
          pressure: 1,
          beerID: 139739,
          temperature: 69,
          batchNumber: 1439,
          status: "cool"
        },
        {
          tankNumber: 14653873,
          pressure: 1,
          beerID: 137836,
          temperature: 69,
          batchNumber: 13468,
          status: "ok"
        },
        {
          tankNumber: 16438,
          pressure: 1,
          beerID: 17368,
          temperature: 69,
          batchNumber: 1384,
          status: "crash"
        },
        {
          tankNumber: 1384346,
          pressure: 1,
          beerID: 13687,
          temperature: 69,
          batchNumber: 157,
          status: "ok"
        }
      ]
    };
  }
};
</script>

<style lang="stylus" scoped>
small = 320px;
mobile = 480px;
tablet = 768px;
laptop = 1024px;
desktop = 1280px;

less-than(size)
  @media screen and (max-width: size)
    {block}

greater-than(size)
  @media screen and (min-width: size)
    {block}

between(size1, size2)
  @media screen and (min-width: size1) and (max-width: size2)
    {block}


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
      grid-template-columns 30vw
  h2
    text-align center


#recipe, #tank
  text-align center
  table
    text-align left
    margin auto
  h2, h3, h4
    text-align center

#tank
  grid-area tank

#recipe
  grid-area recipe
</style>
