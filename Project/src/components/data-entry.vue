<template>
<div>
  <div class="header" v-if="mobile">
    <router-link to="/home-mobile">Home</router-link>
    <h2>Data Entry</h2>
  </div>
  <div id="dataEntry">
    <h2 v-if="!mobile">Data Entry</h2>
    <div id="formFields">
      <table>
        <tr>
          <td>
            <h4>Tank</h4>
          </td>
          <td>
            <select v-model='tank_id' v-on:change="tankChoose">
              <option disabled value="">Tank</option>
              <option v-for='tank in tanks' v-bind:value='tank.id '>{{ tank.tank_id }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <h4>Action</h4>
          </td>
          <td>
            <select v-model='action'>
              <option disabled value="">No Action</option>
              <option v-for='action_option in action_choice' v-bind:value='action_option.id'> {{ action_option.name }}</option>
            </select>
          </td>
        </tr>
      </table>
      <input v-model="SG" type="number" placeholder="Specific Gravity">
      <div class="inline">
        <input v-model="pH" type="number" placeholder="pH">
        <input v-model="ABV" type="number" placeholder="ABV">
        <input v-model="temp" type="number" placeholder="Temperature">
      </div>
      <input v-model="pressure" type="number" placeholder="Pressure">
      <input v-model="volume" type="number" placeholder="Volume">
      <input v-model="bright" type="number" placeholder="Bright">
      <input v-model="generation" type="number" placeholder="Generation">
      <input v-model="time" type="datetime-local" placeholder="Time Measured">
      <input v-model="recipe_id" placeholder="Recipe ID">
      <input v-model="batch_id" placeholder="Batch Name">
    </div>
    <button v-on:click="submit">Submit</button>
  </div>
</div>
</template>

<script>
import router from "../router/index.js"
import Cookie from "js-cookie"

import moment from 'moment'

export default {
  name: 'data-entry',
  data() {
    return {
      SG: '',
      tank_id: '',
      status: '',
      pH: '',
      ABV: '',
      temp: '',
      volume: '',
      generation: '',
      recipe_id: '',
      batch_id: '',
      bright: '',
      pressure: '',
      action: '',
      time: '',
      mobile: false,
      tanks: [], //to save info from all tank info pulled from db
      action_choice: [], //save all info on all possible actions
    };
  },
  beforeMount() {
    if (!Cookie.get('loggedIn')) {
      router.push("/")
    }
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }

    this.$http.get('https://ninkasi-server.herokuapp.com/tanks').then(response => {
      // get available tanks
      for (let tank of response.body) {
        // if the tank is not broken, transferring or completed, add the tank
        if (tank.status != "broken" && tank.status != "transferring" && tank.status != "completed") {
          this.tanks.push(tank)
        }
      }
      // sort our tanks by the tankID
      this.tanks.sort(this.sortTanks)

    }, response => {
      console.warn("Error with the tanks route", response);
    });

    this.$http.get('https://ninkasi-server.herokuapp.com/actions').then(response => {
      // get all our actions so we can put it in a dropdown selection
      this.action_choice = response.body
    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
      console.warn("Error with the actions route", response);
    });

  },
  methods: {
    tankChoose: function() {
      // clear all our values each time we choose a new tank
      this.batch_id = ''
      this.batch_name = ''
      this.generation = ''
      this.volume = ''
      this.recipe_id = ''
      this.ABV = ''
      this.pH = ''
      this.temp = ''
      this.SG = ''
      this.bright = ''
      this.pressure = ''
      // set the time with the required dateime format eg "2018-05-10T15:08"
      this.time = moment().format("YYYY-MM-DDTH:mm")

      //create url to get tank:
      const tankUrl = 'https://ninkasi-server.herokuapp.com/tanks/' + this.tank_id;
      this.$http.get(tankUrl)
        .then(tanksResponse => {
          this.tank_id = tanksResponse.body.id; //get tank database id
          this.tank_name = tanksResponse.body.tank_id //get tank given name
          /********** query batches ********************/
          this.$http.get('https://ninkasi-server.herokuapp.com/batches')
            .then(batchResponse => {
              /********** query batch_contents_versions ********************/
              this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions')
                .then(batchContentsResponse => {

                  // Iterate through batches information
                  for (let batch of batchResponse.body) {
                    //if our batch is in the specified tank
                    if (batch.tank_id === this.tank_id) {
                      //save batch_id, generation, volume, recipe_id
                      this.batch_id   = batch.id
                      this.batch_name = batch.batch_name
                      this.generation = batch.generation
                      this.volume     = batch.volume
                      this.bright     = batch.bright
                      this.recipe_id  = batch.recipe_id
                    }
                  }

                  // our max date will hold the most recent batch date
                  var maxDate = moment("1995-07-29")
                  for (let batchHistory of batchContentsResponse.body) {
                    // if this the batchID that we are looking for and the time is more recent
                    if (batchHistory.batch_id === this.batch_id && moment(batchHistory.updated_at) > maxDate ){
                      // set our new max date
                      maxDate = moment(batchHistory.updated_at)
                      this.ABV      = batchHistory.ABV
                      this.pH       = batchHistory.pH
                      this.temp     = batchHistory.temp
                      this.pressure = batchHistory.pressure
                      this.SG       = batchHistory.SG
                    }
                  }
                }, batchContentsResponse => {
                  this.debugging = 'Debugging Flag: Response error, cant access batches contents page';
                });
              /*****************************************/
            }, batchResponse => {
              this.debugging = 'Debugging Flag: Response error, cant access batches page';
            });
          /*****************************************/
        }, tanksResponse => {
          this.debugging = 'Debugging Flag: Response error, cant access tanks page';
        });
    },
    submit: function() {
      var batchesData = new FormData()
      var id
      batchesData.append('recipe_id', this.recipe_id)
      batchesData.append('tank_id', this.tank_id)
      batchesData.append('volume', this.volume)
      batchesData.append('bright', this.bright)
      batchesData.append('generation', this.generation)
      this.$http.post('https://ninkasi-server.herokuapp.com/batches', batchesData).then(response => {
        id = response.body.id;
        var taskData = new FormData()
        if(this.action != ''){
          taskData.append('action_id', this.action)
          taskData.append('batch_id', id)
          console.log(taskData);
          this.$http.post('https://ninkasi-server.herokuapp.com/tasks', taskData).then(response3 => {
          }, response3 => {
            this.debugging = 'Debugging Flag: Response error, cant access tasks page';
          });
        }

        var batchHistory = new FormData();
        batchHistory.append('batch_id', id)
        batchHistory.append('pH', this.pH)
        batchHistory.append('ABV', this.ABV)
        batchHistory.append('pressure', this.pressure)
        batchHistory.append('temp', this.temp)
        batchHistory.append('SG', this.SG)
        this.$http.post('https://ninkasi-server.herokuapp.com/batch_contents_versions', batchHistory).then(response2 => {
        }, response2 => {
          this.debugging = 'Debugging Flag: Response error, cant access batch contentes page';
        });
      }, response => {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      });


  //  taskData.append('employee_id', employee)
    },
    sortTanks: function(a, b) {
      return a.id - b.id
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#dataEntry
  padding 15px
  grid-area entry
  display flex
  flex-direction column
  align-items center
  +less-than(tablet)
    width 90vw
  margin auto
  min-width 350px
  max-width 500px
  .inline
    input
      width 32%
</style>
