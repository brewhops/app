<template>
  <div>
    <div class="header">
       <router-link to="/">Logout </router-link>
      <h2>Home</h2>
    </div>
    <div id="content">
      <data-entry></data-entry>
      <div id="tankInfo">
        <h2>Tank Info</h2>
        <div id="tankContents">
          <router-link to="/data" v-for="tank in tanks" :key="tank.tankNumber">
            <table class="tank" v-bind:class="tank.status">
              <tr>
                <td>{{tank.tankNumber}}</td>
                <td>{{tank.pressure}}</td>
              </tr>
              <tr>
                <td>{{tank.beerID}}</td>
                <td>{{tank.temperature}}</td>
              </tr>
              <tr>
                <td>{{tank.batchNumber}}</td>
                <td>{{tank.status}}</td>
              </tr>
            </table>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import DataEntry from './data-entry.vue'

export default {
  name: 'home',
  components: {
    'data-entry': DataEntry
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
  grid-template-columns 1fr 1fr
  grid-template-areas "entry info"
  +less-than(laptop)
    grid-template-columns 98vw
    grid-template-areas "entry" "info"
  justify-items center

#tankInfo
  grid-area info
  h2
    text-align center
  #tankContents
    height 80vh
    overflow scroll
    padding 0 10px
    display grid
    grid-template-columns repeat(3, 200px)
    +less-than(tablet)
      grid-template-columns repeat(2, 200px)
    grid-gap 10px
    color white
    font-weight 100
    a
      text-decoration none
      color white
    .tank
      background Teal
      width 100%
      td:nth-child(2)
          text-align right
      td
          padding 5px
    .cap
        background Orange
    .cool
        background Brown
    .crash
        background Red


</style>
