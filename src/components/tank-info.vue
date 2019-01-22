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
      <h2>Tank {{ tankInfo.tank_name }}</h2>
      <table>
        <tr v-if='tankInfo.action !== ""' class="important">
          <td>Action</td>
          <td>{{ tankInfo.action }}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td>{{ tankInfo.status }}</td>
        </tr>
        <tr>
          <td>Brand ID</td>
          <td>{{ tankInfo.recipe_id }}</td>
        </tr>
        <tr>
          <td>Batch Name</td>
          <td>{{ tankInfo.batch_name }}</td>
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
          <td>Bright</td>
          <td>{{ tankInfo.bright }}</td>
        </tr>
        <tr>
          <td>Temperature</td>
          <td>{{ tankInfo.temp }}º F</td>
        </tr>
        <tr>
          <td>Specific Gravity</td>
          <td>{{ tankInfo.SG }}</td>
        </tr>
        <tr>
          <td>pH</td>
          <td>{{ tankInfo.pH }}</td>
        </tr>
        <tr>
          <td>Pressure</td>
          <td>{{ tankInfo.pressure }}</td>
        </tr>
        <tr>
          <td>ABV</td>
          <td>{{ tankInfo.ABV }}%</td>
        </tr>
        <tr>
          <td>Time Last Updated</td>
          <td>{{ tankInfo.time }}</td>
        </tr>
      </table>
      <router-link v-bind:to="doneLink"><button type="button" name="button">Add Data</button> </router-link>
    </div>
    <recipe v-bind:recipeID="tankInfo.recipe_id"></recipe>
  </div>
</div>
</template>

<script lang='ts'>

import recipe from './recipe.vue'
import chart from './chart.vue'

import router from "../router/index.js"
import Cookie from "js-cookie"

import moment from "moment"

interface ITankInfo {
  name: any;
  components: any;
  data: any;
  beforeMount: any;
  debugging?: any;
  $route?: any;
  $http?: any;
  tankInfo?: any;
  doneLink?: any;
  history?: any;
  home?: any;
  mobile?: any;
}

const tankInfo: ITankInfo = {
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
        "batch_name": '',
        "volume": '',
        "bright": '',
        "generation": '',
        "SG": '',
        "pH": '',
        "ABV": '',
        "temp": '',
        "status": '',
        "time": '',
        "tank_name": '',
        action: '',
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
    var tankUrl = process.env.API + '/tanks/' + this.$route.params.tankID

    this.$http.get(tankUrl).then(tanksResponse => {
      // set the tank stat]us
      this.tankInfo.tank_id = tanksResponse.body.id
      //HEADS UP: tank_id will be changed to tank_name in db soon, for now id is tank id and tank_id is the name we call it
      this.tankInfo.tank_name = tanksResponse.body.tank_id
      this.tankInfo.status = tanksResponse.body.status
      /********** query batches ********************/
      this.$http.get(process.env.API + '/batches').then(batchResponse => {
        /********** query batch_contents_versions ********************/
        // Get batches information
        for (let batch of batchResponse.body) {
          // if our batch tankID is the tankID we are looking for set some data
          if(batch.tank_id === this.tankInfo.tank_id) {
            this.tankInfo.batch_id   = batch.id
            this.tankInfo.batch_name = batch.batch_name
            this.tankInfo.bright     = batch.bright
            this.tankInfo.generation = batch.generation
            this.tankInfo.volume     = batch.volume
            this.tankInfo.recipe_id  = batch.recipe_id
          }
        }

        // get info on the action the tank needs
        this.$http.get(process.env.API + '/tasks').then(tasksResponse => {
          let actionID
          for (let task of tasksResponse.body) {
            // if the batch is the one we are looking for
            if (task.batch_id === this.tankInfo.batch_id) {
              // set our actionID and break out of the loop
              actionID = task.action_id
              break
            }
          }
          // if our actionID was set
          if (actionID >= 0) {
            // get the action associated with that ID
            this.$http.get(process.env.API + '/actions/' + actionID).then(actionResponse => {
              this.tankInfo.action = actionResponse.body.name
            })
          }
        })

        this.$http.get(process.env.API + '/batch_contents_versions').then(batchContentsResponse => {
          // Find most recent batch in batch contents and pull that info
          var max = moment("1995-07-29");
          var date
          for(let batchContents of batchContentsResponse.body){
            var batchTime = moment(batchContents.updated_at);
            if(batchContents.batch_id === this.tankInfo.batch_id) {
              // format the date to include the month, day, year, hour and minute
              date = moment(batchContents.updated_at).format('MM/DD/YY H:m')
              this.history.date.push(date)
              this.history.temp.push(batchContents.temp)
              this.history.abv.push(batchContents.ABV)
              this.history.sg.push(batchContents.SG)
              this.history.ph.push(batchContents.pH)
            }

            if(batchContents.batch_id === this.tankInfo.batch_id && batchTime > max) {
              max = moment(batchContents.updated_at)
              this.tankInfo.ABV  = batchContents.ABV
              this.tankInfo.pH   = batchContents.pH
              this.tankInfo.temp = batchContents.temp
              this.tankInfo.SG   = batchContents.SG
              this.tankInfo.pressure   = batchContents.pressure
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

export default tankInfo;
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

.important
  color red
  font-weight bold
</style>
