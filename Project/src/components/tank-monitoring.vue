<template>
<div>
  <div class="header" v-if="mobile">
     <router-link to="/home-mobile">Home</router-link>
    <h2>Tank Monitoring</h2>
  </div>
  <div id="tankInfo">
    <h2 v-if="!mobile">Tank Monitoring</h2>
    <div id="tankContents">
      <router-link to="/tank-info" v-for="tank in tanks" :key="tank.tankNumber">
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
</template>

<script>

export default {
  name: 'tank-monitoring',
  data() {
    return {
      mobile: false,
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
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'


#tankInfo
  grid-area info
  h2
    text-align center
  #tankContents
    padding 15px
    max-height 80vh
    overflow scroll
    display grid
    justify-content center
    grid-gap 10px
    color white
    font-weight 100

    +greater-than(desktop)
      grid-template-columns repeat(4, 170px)

    +between(laptop, desktop)
      grid-template-columns repeat(3, 150px)

    +less-than(laptop)
      grid-template-columns repeat(2, 150px)
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
