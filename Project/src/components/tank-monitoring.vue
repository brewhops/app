<template>
<div>
<div class="header" v-if="mobile">
   <router-link to="/home-mobile">Home</router-link>
  <h2>Tank Monitoring</h2>
</div>
<div id="tankInfo">
  <h2>Tank Info</h2>
  <div id="tankContents">
    <a v-on:click="showTankInfo(tank.id)" v-for="tank in tanks">
      <table class="tank" v-bind:class="tank.action">
        <tr>
          <td>{{tank.name}}</td>
          <td v-if='tank.pressure'>{{tank.pressure}} psi</td>
        </tr>
        <tr>
          <td>{{tank.recipe_id}}</td>
          <td v-if='tank.temperature'>{{tank.temperature}}ºF</td>
        </tr>
        <tr>
          <td>{{tank.batch.name}}</td>
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
import moment from 'moment'
export default {
  name: 'tank-monitoring',
  data() {
    return {
      mobile: false,
      tanks: [],
      // contents of a square is tankName, pressure, recipeName, temperature, batchNumber, Status
    };
  },
  beforeMount() {
    if (!Cookie.get('loggedIn')) {
      router.push("/")
    }
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }

    const base = 'https://ninkasi-server.herokuapp.com'

    //get our batches
    this.$http.get(base + '/batches')
      .then(batchResponse => {

      //get the history of our batches to find most recent measurements
      this.$http.get(base + '/batch_contents_versions')
        .then(batchContentsResponse => {

        //get tanks to find status
        this.$http.get(base + '/tanks')
          .then(tanksResponse => {

            //get tanks to find tasks
            this.$http.get(base + '/tasks')
              .then(tasksResponse => {

                //get tanks to find actions
                this.$http.get(base + '/actions')
                  .then(actionsResponse => {

                for(let tankInfo of tanksResponse.body) {

                  // create a temporary tank for us to fill with data
                  let tank = {
                    // keep track of tank id for searching
                    id: tankInfo.id,
                    // keep track of tank name for displaying
                    name: tankInfo.tank_id,
                    status: tankInfo.status,
                    batch: {},
                  }

                  for(let batch of batchResponse.body) {
                    // if our batches tankID matches our tankID
                    if (batch.tank_id === tank.id) {
                      // add in our batchesID to the tank info box
                      tank.batch.id   = batch.id
                      tank.batch.name = batch.batch_name
                      // add the recipeID to the tank info box
                      tank.recipe_id  = batch.recipe_id
                    }
                  }

                  //keep track of most recent date with a starting low value
                  var max = moment("1995-07-29");

                  //for every data point we have in a batch
                  for(let batchHistory of batchContentsResponse.body) {

                    //if the batchID of our data point matches the batchID we are looking for
                    if(batchHistory.batch_id === tank.batch.id) {

                      //if the date is the largest, it is the most recent one
                      if(moment(batchHistory.updated_at) > max){
                         max = moment(batchHistory.updated_at)
                         tank.pressure = batchHistory.pressure;
                         tank.temperature = batchHistory.temp;
                      }
                    }
                  }

                  //find task associated with tank
                  for(let task of tasksResponse.body){
                    if(task.batch_id === this.batch_id){
                      tank.action_id = task.action_id
                    }
                  }
                  //find action associated with task
                  for(let action of actionsResponse.body){
                      if(action.action_id === tank.action_id){
                        tank.action = action.name
                      }
                  }
                  //push data holder to the tanks array
                  console.log(tank);
                  this.tanks.push(tank);
               }

                this.tanks.sort(this.sortTanks)
              }, actionsResponse => {
                console.log('Response error, cant access actions page', response);
              });
            }, tasksResponse => {
             console.log('Response error, cant access tasks page', response);
           });
          }, tanksResponse => {
           console.log('Response error, cant access tanks page', response);
         });
         /*************************************/
      }, batchContentsResponse => {
        this.debugging = 'Debugging Flag: Response error, cant access batches contents page';
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
