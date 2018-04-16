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
        <chart v-bind:date="history.date" v-bind:data="history.temp"></chart>
        <chart v-bind:date="history.date" v-bind:data="history.sg"></chart>
        <chart v-bind:date="history.date" v-bind:data="history.abv"></chart>
        <chart v-bind:date="history.date" v-bind:data="history.ph"></chart>
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
import chart from './chart.vue'

import router from "../router/index.js"
import Cookie from "js-cookie"

import moment from "moment"

export
default {
  name: 'tank-info',
  components: {
    'recipe': recipe,
    'chart': chart,
  },
  data() {
    return {
      tankInfo: {
        "tank_id": '',
        "recipe_id": '',
        "batch_id": '',
        "volume": '',
        "bright": '',
        "generation": '',
        "sG": '',
        "pH": '',
        "aBV": '',
        "temp": '',
        "status": '',
        "time": '',
      },
      history: {
        date: ['Date'],
        temp: ['Temperature'],
        abv: ['ABV'],
        sg: ['Specific Gravity'],
        ph: ['pH'],
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
    var base = 'https://ninkasi-server.herokuapp.com'
    var tankUrl = base + '/tanks/' + this.$route.params.tankID

    this.$http.get(tankUrl).then(tanksResponse => {
      // set the tank stat]us
      this.tankInfo.tank_id = tanksResponse.body.id
      this.tankInfo.status = tanksResponse.body.status
      /********** query batches ********************/
      this.$http.get(base + '/batches').then(batchResponse => {
        /********** query batch_contents_versions ********************/
        this.$http.get(base + '/batch_contents_versions').then(batchContentsResponse => {
          // Get batches information
          for (let batch of batchResponse.body) {
            // if our batch tankID is the tankID we are looking for set some data
            if(batch.tank_id === this.tankInfo.tank_id) {
              this.tankInfo.batch_id   = batch.id
              this.tankInfo.bright     = batch.bright
              this.tankInfo.generation = batch.generation
              this.tankInfo.volume     = batch.volume
              this.tankInfo.recipe_id  = batch.recipe_id
            }
          }

          // Find most recent batch in batch contents and pull that info
          var max = 0
          var date
          for(let batchContents of batchContentsResponse.body){
            if(batchContents.batch_id === this.tankInfo.batch_id) {
              // format the date to include the month, day, year, hour and minute
              date = moment(batchContents.updated_at).format('MM/DD/YY H:m')
              this.history.date.push(date)
              this.history.temp.push(batchContents.temp)
              this.history.abv.push(batchContents.ABV)
              this.history.sg.push(batchContents.SG)
              this.history.ph.push(batchContents.pH)
            }

            if(batchContents.batch_id === this.tankInfo.batch_id && batchContents.version_number > max) {
              max = batchContents.version_number
              this.tankInfo.aBV  = batchContents.ABV
              this.tankInfo.pH   = batchContents.pH
              this.tankInfo.temp = batchContents.temp
              this.tankInfo.sG   = batchContents.SG
              // use a lowercase h to change the hours from 24 to 12
              // the mm sets the minute with a leading 0
              this.tankInfo.time = moment(batchContents.updated_at).format('MM/DD/YY H:mm')
            }
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
