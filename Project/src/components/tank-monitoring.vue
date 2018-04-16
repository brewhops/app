<template>
<div>
<div class="header" v-if="mobile">
   <router-link to="/home-mobile">Home</router-link>
  <h2>Tank Monitoring</h2>
</div>
<div id="tankInfo">
  <h2>Tank Info</h2>
  <div id="tankContents">
    <a v-on:click="showTankInfo(tank.tank_id)" v-for="tank in tanks">
      <table class="tank" v-bind:class="tank.status">
        <tr>
          <td>{{tank.tank_id}}</td>
          <td v-if='tank.pressure'>{{tank.pressure}} psi</td>
        </tr>
        <tr>
          <td>{{tank.recipe_id}}</td>
          <td v-if='tank.temperature'>{{tank.temperature}}ºF</td>
        </tr>
        <tr>
          <td>{{tank.batch_id}}</td>
          <td>{{tank.status}}</td>
        </tr>
      </table>
    </a>
  </div>
</div>
</div>
</template>

<script>

import router from "../router/index.js"
import Cookie from "js-cookie"

export default {
  name: 'tank-monitoring',
  data() {
    return {
      mobile: false,
      tanks: [],
        //tankNumber, pressure, recipe_id, temperature, batchNumber, Status
    };
  },
  beforeMount() {
    if (!Cookie.get('loggedIn')) {
        router.push("/")
    }
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }

    //get our batches
    this.$http.get('https://ninkasi-server.herokuapp.com/batches')
      .then(batchResponse => {
      var batches = batchResponse.body;

      //get the history of our batches to find most recent measurements
      this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions')
        .then(batchContentsResponse => {
        //fill batch contentes with database
        var batchesContents = batchContentsResponse.body;

        //get tanks to find status
        this.$http.get('https://ninkasi-server.herokuapp.com/tanks')
          .then(tanksResponse => {
            var tanks = tanksResponse.body

            for(var x in tanks) {
              //create a temporary tank for us to fill with data
              var tank = {
                tank_id: tanks[x].id,
                status: tanks[x].status,
              }

              for(var z in batches) {
                //if our batches tankID matches our tankID
                if (batches[z].tank_id === tank.tank_id) {
                  //add in our batchesID to the tank info box
                  tank.batch_id = batches[z].id
                  //add the recipeID to the tank info box
                  tank.recipe_id = batches[z].recipe_id
                }
              }

              //for every data point we have in a batch
              for(var y in batchesContents){
                //if the batchID of our data point matches the batchID we are looking for
                if(batchesContents[y].batch_id === tank.batch_id){
                  //if the version number is 0, it is the most recent one
                  if(batchesContents[y].version_number === 0){
                     tank.pressure = batchesContents[y].pressure;
                     tank.temperature = batchesContents[y].temp;
                  }
                }
              }

              //push data holder to the tanks array
              this.tanks.push(tank);
           }

           this.tanks.sort(this.sortTanks)
          }, tanksResponse => {
           console.log('Response error, cant access employees page', response);
         });
         /*************************************/
      }, batchContentsResponse => {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      });
    }, batchResponse => {
      this.debugging = 'Debugging Flag: Response error, cant access batches page';
    });

  },
  methods: {
    showTankInfo: function(tankID) {
      // send us over to the tank info page and set the id on the url
      // to be the tankID that we clicked on.
      router.push({ name: 'tank-info', params: { 'tankID': tankID } })
    },
    sortTanks: function(a, b) {
      return a.tank_id - b.tank_id
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'


#tankInfo
  grid-area info
  h2
    text-align center
  #tankContents
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
      height 100%
      td:nth-child(2)
          text-align right
      td
          padding 5px
    .cap
        background Orange
    .cool
        background Brown
    .crash
        background green
    .broken
        background Red
    .busy
        background #c9c200


</style>
