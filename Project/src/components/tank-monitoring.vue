<template>
<div>
<div class="header" v-if="mobile">
   <router-link to="/home-mobile">Home</router-link>
  <h2>Tank Monitoring</h2>
</div>
<div id="tankInfo">
  <h2>Tank Info</h2>
  <div id="tankContents">
    <router-link to="/tank-info" v-for="tank in tanks" :key="tank.tankNumber">
      <table class="tank" v-bind:class="tank.status">
        <tr>
          <td>{{tank.tank_id}}</td>
          <td>{{tank.pressure}}</td>
        </tr>
        <tr>
          <td>{{tank.recipe_id}}</td>
          <td>{{tank.temperature}}</td>
        </tr>
        <tr>
          <td>{{tank.batch_id}}</td>
          <td>{{tank.status}}</td>
        </tr>
      </table>
    </router-link>
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
      batchesData: [],
      batchesContentsData: [],
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

    //get batches from heroku
    this.$http.get('https://ninkasi-server.herokuapp.com/batches')
      .then(batchResponse => {
      this.batchesData = batchResponse.body;
      //get batch contents to find most recent measurements
      this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions')
        .then(batchContentsResponse => {
        //fill batch contentes with database
        this.batchesContentsData = batchContentsResponse.body;
        //get tanks to find status
        this.$http.get('https://ninkasi-server.herokuapp.com/tanks')
          .then(tanksResponse => {

            //for each batch, fill variables and most recent brewing data to display
            for(var x in this.batchesData){
              //object as a holder for info pulled from batches and batch_contents_versions
              var tank = {
                tank_id: '',
                pressure: '',
                temperature: '',
                recipe_id: '',
                batch_id: '',
                status: '',
              }
              //save batch id and tank id
              tank.batch_id = this.batchesData[x].id;
              tank.tank_id = this.batchesData[x].tank_id;
              tank.recipe_id = this.batchesData[x].recipe_id;

              //iterate through tank database to find tank Status
              for(var x in (tanksResponse.body)){
                if((tanksResponse.body)[x].id == tank.tank_id){
                  tank.status = (tanksResponse.body)[x].status
                }
              }
              //object as holder to find most recent batch_contents_versions
              var mostRecent = {
                value: -1,
                pressure: '',
                temperature: '',
              }
              //iterate through batch contents, save most recent
              for(var y in this.batchesContentsData){
                if(this.batchesContentsData[y].batch_id === tank.batch_id){
                  if(this.batchesContentsData[y].version_number > mostRecent.value){
                       mostRecent.value = this.batchesContentsData[y].version_number;
                       mostRecent.pressure = this.batchesContentsData[y].pressure;
                       mostRecent.temperature = this.batchesContentsData[y].temperature;
                  }
                }
              }
              //put temp and pressure from most recent into tanks
              tank.temperature = mostRecent.temperature;
              tank.pressure = mostRecent.pressure;

              //push data holder to the tanks array
              this.tanks.push(tank);
           }
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
        background green
    .broken
        background Red
    .busy
        background #c9c200


</style>
