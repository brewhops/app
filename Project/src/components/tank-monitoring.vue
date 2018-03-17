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
          <td>{{tank.beerID}}</td>
          <td>{{tank.temperature}}</td>
        </tr>
        <tr>
          <td>{{tank.batchID}}</td>
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
      batchesData: [],
      batchesContentsData: [],
      tanks: [],
      tankInfo: {
        tank_id: '',
        pressure: '',
        temperature: '',
        beerID: '',
        batchID: '',
        status: '',
      }
        //tankNumber, pressure, beerID, temperature, batchNumber, Status
    };
  },
  beforeMount() {

    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }

    //get batches from heroku
    this.$http.get('https://ninkasi-server.herokuapp.com/batches').then(response1 => {
      this.batchesData = response1.body;
      this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions').then(response2 => {
        this.batchesContentsData = response2.body;
        /***** Inside both get requests *****/
        //console.log(this.batchesData);
        for(var x in this.batchesData){
          var tank = this.tankInfo; //use temp holder that has all the parts of the obj we need

          tank.batchID = this.batchesData[x].id; //save current batchesData
          tank.tank_id = this.batchesData[x].tank_id;

          var recipe_id = this.batchesData[x].recipe_id;
          var y;
          var pressure, temperature; //TODO: CHNGE TO AN OBJECT NOT JUST MULTIPLE VARIABLES
          var max = -1;
          //iterate through batch contents, save the contents of the version_number that is the most recent
          for(y in this.batchesContentsData){
            if(this.batchesContentsData[y].batch_id === this.batchesData[x].id){
              if(this.batchesContentsData[y].version_number > max){
                  console.log()
                   max = this.batchesContentsData[y].version_number;
                   pressure = this.batchesContentsData[y].pressure;
                   temperature = this.batchesContentsData[y].temperature;
              }
            }
          }
          //save temp and pressure from most recent
          tank.temperature = temperature;
          tank.pressure = pressure;
          tank.status = "OK"; //TODO: TEMPORARY, MAKE NEW

          //push data holder to the tanks array
          this.tanks.push(tank);

       }
         /*************************************/
      }, response2 => {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      });
    }, response1 => {
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
        background Red


</style>
