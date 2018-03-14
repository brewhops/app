<template>
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
</template>

<script>

export default {
  name: 'tank-monitoring',
  data() {
    return {
      msg: '',
      batchesData: [],
      batchesContentsData: [],
      tanks: [],
        //tankNumber, pressure, beerID, temperature, batchNumber, Status
    };
  },
  beforeMount() {
    //get batches from heroku
    this.$http.get('https://ninkasi-server.herokuapp.com/batches').then(response => {
      this.batchesData = response.body;
    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access batches page';
    });
    this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions').then(response => {
      this.batchesContentsData = response.body;
    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access batches page';
    });

    var x;
    var obj = {
      batchID: ''
    };
    for(x in this.batchesData){
      obj.batchID = this.batchesData[x].batchID;
      this.tanks[x] = obj;
    /*  this.tanks[x].append('batchID', this.batchesData[x].batchID);
      this.tanks[x].append('tank_id', this.batchesData[x].tank_id);
      var recipe_id = this.batchesData[x].recipe_id;
      this.tanks[x].append('status', "OK"); //TODO: This is termporary! Change when we have a task table
      console.log(this.tanks);
      var y;
      var max;
      //iterate through batch contents, save the contents of the version_number that is the most recent
      for(y in this.batchesContentsData){
        if(this.batchesContentsData[y].batchID === this.batchesData[x].batchID){
          if(this.batchesContentsData[y].version_number > max){
               max = this.batchesContentsData[y];
          }
        }
      }
      this.tanks[x].append('temperature', this.batchesContentsData[y].temperature);
      this.tanks[x].append('pressure', this.batchesContentsData[y].pressure)
      this.tanks[x].append('status', "OK"); //TODO: This is termporary! Change when we have a task table
    */  //this.tanks[x].append('beerID', recipe_id); //TODO: This is temporary! Change by using recipe ID

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
