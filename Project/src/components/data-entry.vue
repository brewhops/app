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
              <option v-for='tank in tanks' v-bind:value='tank.id '>{{ tank.tank_id }}</option>
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
      <input v-model="volume" type="number" placeholder="Volume">
      <input v-model="generation" type="number" placeholder="Generation">
      <input type="datetime-local" placeholder="Time Measured">
      <input v-model="recipe_id" placeholder="Recipe ID">
      <input v-model="batch_id" placeholder="Batch Name">
      <table>
        <tr>
          <td>
            <h4>Action</h4>
          </td>
          <td>
            <select v-model='action'>
              <option v-for='action_option in action_choice' v-bind:value='action_option.id'> {{ action_option.name }}</option>
            </select>
          </td>
        </tr>
      </table>
      <!--<tr>
         <tr>
          <td>
            <h4>Assign Employee</h4>
          </td>
          <td>
            <select v-model='action' placeholder="Action">
              <option v-for='option in action_choice' v-bind:value='action'> {{ option.name }}</option>
            </select>
          </td>
        </tr> -->

    </div>
    <button v-on:click="submit">Submit</button>
  </div>
</div>
</template>

<script>
import router from "../router/index.js"
import Cookie from "js-cookie"

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
      action: '',
      mobile: false,
      obj: {},
      tanks: [], //to save info from all tank info pulled from db
      action_choice: [], //save all info on all possible actions
      //removed "status"
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
      var x;
      for (x in response.body) {
        if (response.body[x].status != "broken" && response.body[x].status != "transferring" && response.body[x].status != "completed") {
          this.tanks.push(response.body[x])
        }
      }
      this.tanks.sort(this.sortTanks)

    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
      console.log(response);
    });

    this.$http.get('https://ninkasi-server.herokuapp.com/actions').then(response => {
      for (var action of response.body) {
        this.action_choice.push(action)
      }
      this.action_choice.sort(this.sortActions)

    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
      console.log(response);
    });

  },
  methods: {
    tankChoose: function() {
      //create url to get tank:
      var tankUrl = 'https://ninkasi-server.herokuapp.com/tanks/' + this.tank_id;
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
                  for (var x in (batchResponse.body)) {
                    //if our batch is in the specified tank
                    if ((batchResponse.body)[x].tank_id === this.tank_id) {
                      //save batch_id, generation, volume, recipe_id
                      this.batch_id = (batchResponse.body)[x].batch_id
                      this.batch_name = (batchResponse.body)[x].batch_name
                      this.generation = (batchResponse.body)[x].generation
                      this.volume = (batchResponse.body)[x].volume
                      this.recipe_id = (batchResponse.body)[x].recipe_id
                    }
                  }
                  //Find most recent batch in batch contents and pull that info
                  //var max is to keep track of most recent date
                  var max = 0;
                  for (var y in batchContentsResponse.body) {
                    if ((batchContentsResponse.body)[y].batch_id === this.batch_id && (batchContentsResponse.body)[y].date > max){
                      //update max date
                      max = (batchContentsResponse.body)[y].updated_at
                      //save ABV, pH, temperature, and SG
                      this.ABV = (batchContentsResponse.body)[y].ABV
                      this.pH = (batchContentsResponse.body)[y].pH
                      this.temp = (batchContentsResponse.body)[y].temp
                      this.SG = (batchContentsResponse.body)[y].SG
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
        batchHistory.append('ph', this.pH)
        batchHistory.append('abv', this.ABV)
        batchHistory.append('pressure', this.pressure)
        batchHistory.append('temp', this.temp)
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
    },
    // sortActions:function(a, b){
    //   if(a.name == "OK")
    //     return -100
    //   else {
    //     return a.id - b.id
    //   }
    //}
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
