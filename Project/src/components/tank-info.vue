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
      <h3>{{ $route.params.tankID }}</h3>
      <table>
        <tr>
          <td>Status</td>
          <td> {{ tankInfo.status }}</td>
        </tr>
        <tr>
          <td>Brand ID</td>
          <td>{{ tankInfo.recipe_id }}</td>
        </tr>
        <tr>
          <td>Batch Number</td>
          <td>{{ tankInfo.batch_id }}</td>
        </tr>
        <tr>
          <td>Generation</td>
          <td>{{ tankInfo.generation }}</td>
        </tr>
        <tr>
          <td>Volume</td>
          <td>{{ tankInfo.volume }}</td>
        </tr>
        <tr>
          <td>Temperature</td>
          <td>{{ tankInfo.temp }}º F</td>
        </tr>
        <tr>
          <td>Specific Gravity</td>
          <td>{{ tankInfo.sG }}</td>
        </tr>
        <tr>
          <td>pH</td>
          <td>{{ tankInfo.pH }}</td>
        </tr>
        <tr>
          <td>ABV</td>
          <td>{{ tankInfo.aBV }}%</td>
        </tr>
        <tr>
          <td>Time Last Updated</td>
          <td>{{ tankInfo.time }}</td>
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

import router from "../router/index.js"
import Cookie from "js-cookie"

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
      tankInfo: {
       /*"id" : 1,
       "recipe_id" : 'Pacific Rain',
       "tank_id" : 2,
       "volume": 20.0,
       "bright": 15.0,
       "generation" : 10.0,
       "sG" : 25.0,
       "pH" :5.5,
       "aBV": 5.5,
       "temp": 45,
       "status": 'ok',*/
       "tank_id" : '',
       "recipe_id" : '',
       "batch_id" : '',
       "volume": '',
       "bright": '',
       "generation" : '',
       "sG" : '',
       "pH" :'',
       "aBV": '',
       "temp": '',
       "status": '',
       "time" : '',

     },
      doneLink: '',
      home: '',
      mobile: false
    };
  },
  beforeMount() {

    // if the user is not logged in send them to the login page
    if (!Cookie.get('loggedIn')) {
        router.push("/")
    }

    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
      this.doneLink = '/data-entry'
      this.home = '/home-mobile'
    } else {
      this.doneLink = '/home'
      this.home = '/home'
    }

    //create url to get tank:
    var tankUrl = 'https://ninkasi-server.herokuapp.com/tanks/' + '1';

    this.$http.get(tankUrl)
      .then(tanksResponse => {
      this.tankInfo.tank_id = tanksResponse.body.id; //get tank id
      this.tankInfo.status = tanksResponse.body.status
      /********** query batches ********************/
      this.$http.get('https://ninkasi-server.herokuapp.com/batches')
        .then(batchResponse => {
      //  this.batchesData = batchResponse.body
        /********** query batch_contents_versions ********************/
        this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions')
          .then(batchContentsResponse => {


            //Get batches information
           for(var x in (batchResponse.body)){
            if((batchResponse.body)[x].tank_id === this.tankInfo.tank_id){
              this.tankInfo.batch_id = (batchResponse.body)[x].id
              this.tankInfo.bright = (batchResponse.body)[x].bright
              this.tankInfo.generation = (batchResponse.body)[x].generation
              this.tankInfo.volume = (batchResponse.body)[x].volume
              this.tankInfo.recipe_id = (batchResponse.body)[x].recipe_id
              console.log((batchResponse.body)[x]);
              console.log(this.tankInfo);
            }
          }

          //Find most recent batch in batch contents and pull that info
          var max = 0
          for(var y in batchContentsResponse.body){
            if((batchContentsResponse.body)[y].batch_id === this.tankInfo.batch_id && (batchContentsResponse.body)[y].version_number > max)
              max = (batchContentsResponse.body)[y].version_number
              this.tankInfo.aBV = (batchContentsResponse.body)[y].ABV
              this.tankInfo.pH = (batchContentsResponse.body)[y].ph
              this.tankInfo.temp = (batchContentsResponse.body)[y].temp
              this.tankInfo.sG = (batchContentsResponse.body)[y].SG
              this.tankInfo.time = (batchContentsResponse.body)[y].date_time_reading
          }

          }, batchContentsResponse => {
            this.debugging = 'Debugging Flag: Response error, cant access batches page';
          });
        /*****************************************/
      }, batchResponse => {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      });
    /*****************************************/
    }, tanksResponse => {
      this.debugging = 'Debugging Flag: Response error, cant access tanks page';
    });
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
