<template>
  <div>
    <div class="header" v-if="mobile">
      <router-link to="/home-mobile">Home</router-link>
      <h2>Tank Monitoring</h2>
    </div>
    <div id="tankInfo">
      <h2>Tank Info</h2>
      <div id="tankContents">
        <a v-on:click="showTankInfo(tank.id)" v-for="tank in tanks" v-bind:key="tank.id">
          <table class="tank" v-bind:class="tank.action">
            <tr>
              <td>{{ tank.name }}</td>
              <td v-if="tank.pressure">{{ tank.pressure }} psi</td>
            </tr>
            <tr>
              <td>{{ tank.airplane_code }}</td>
              <td v-if="tank.temperature">{{ tank.temperature }}ºF</td>
            </tr>
            <tr>
              <td>{{ tank.batch.name }}</td>
              <td>{{ tank.action }}</td>
            </tr>
          </table>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';
import moment from 'moment';

// tslint:disable: max-func-body-length no-any

interface ITank {
  action?: any;
  action_id?: any;
  batch?: any;
  pressure?: any;
  temperature?: any;
  recipe_id?: any;
  airplane_code?: any;
  id?: any;
  name?: any;
  status?: any;
}

interface ITankMonitoringState {
  mobile: boolean;
  tanks: ITank[];
}

export default Vue.extend({
  name: 'tank-monitoring',
  data(): ITankMonitoringState {
    return {
      mobile: false,
      tanks: []
      // contents of a square is tankName, pressure, recipeName, temperature, batchNumber, Status
    };
  },
  // tslint:disable-next-line:max-func-body-length
  async beforeMount() {
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }
    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
    }

    try {
      const batchResponse = await this.$http.get(`${process.env.API}/batches`);
      const tanksResponse = await this.$http.get(`${process.env.API}/tanks`);
      const tasksResponse = await this.$http.get(`${process.env.API}/tasks`);
      const actionsResponse = await this.$http.get(`${process.env.API}/actions`);
      const recipeResponse = await this.$http.get(`${process.env.API}/recipes`);
      for (const tankInfo of tanksResponse.data) {
        // create a temporary tank for us to fill with data
        const tank: ITank = {
          // keep track of tank id for searching
          id: tankInfo.id,
          // keep track of tank name for displaying
          name: tankInfo.tank_id,
          status: tankInfo.status,
          batch: {}
        };

        for (const batch of batchResponse.data) {
          // if our batches tankID matches our tankID
          if (batch.tank_id === tank.id) {
            // add in our batchesID to the tank info box
            tank.batch.id = batch.id;
            tank.batch.name = batch.batch_name;
            // add the recipeID to the tank info box
            tank.recipe_id = batch.recipe_id;
          }
        }
        for (const recipeHistory of recipeResponse.data) {
          if (tank.recipe_id === recipeHistory.id) {
            tank.airplane_code = recipeHistory.airplane_code;
          }
        }

        // keep track of most recent date with a starting low value
        // let max = moment('1995-07-29');

        // // for every data point we have in a batch
        // for (const batchHistory of batchContentsResponse.json()) {
        //   // if the batchID of our data point matches the batchID we are looking for
        //   if (batchHistory.batch_id === tank.batch.id) {
        //     // if the date is the largest, it is the most recent one
        //     if (moment(batchHistory.updated_at) > max) {
        //       max = moment(batchHistory.updated_at);
        //       tank.pressure = batchHistory.pressure;
        //       tank.temperature = batchHistory.temp;
        //     }
        //   }
        // }

        // find task associated with tank
        for (const task of tasksResponse.data) {
          if (tank.batch.id === task.batch_id) {
            // if task has our batch id
            tank.action_id = task.action_id; // save the asscoiated action
          }
        }

        // find action associated with task
        for (const action of actionsResponse.data) {
          if (tank.action_id === action.id) {
            tank.action = action.name;
          }
        }
        // push data holder to the tanks array
        this.tanks.push(tank);
      }

      this.tanks.sort(this.sortTanks);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }

    // get our batches
    // this.$http.get(`${process.env.API}/batches`).then(
    //   batchResponse => {
    //     //get the history of our batches to find most recent measurements
    //     this.$http.get(process.env.API + '/batch_contents_versions').then(
    //       batchContentsResponse => {
    //         //get tanks to find status
    //         this.$http.get(process.env.API + '/tanks').then(
    //           tanksResponse => {
    //             //get tanks to find tasks
    //             this.$http.get(process.env.API + '/tasks').then(
    //               tasksResponse => {
    //                 //get tanks to find actions
    //                 this.$http.get(process.env.API + '/actions').then(
    //                   actionsResponse => {
    //                     //get tanks to find actions
    //                     this.$http.get(process.env.API + '/recipes').then(
    //                       recipeResponse => {
    //                         for (let tankInfo of tanksResponse.body) {
    //                           // create a temporary tank for us to fill with data
    //                           let tank: ITank = {
    //                             // keep track of tank id for searching
    //                             id: tankInfo.id,
    //                             // keep track of tank name for displaying
    //                             name: tankInfo.tank_id,
    //                             status: tankInfo.status,
    //                             batch: {}
    //                           };

    //                           for (let batch of batchResponse.body) {
    //                             // if our batches tankID matches our tankID
    //                             if (batch.tank_id === tank.id) {
    //                               // add in our batchesID to the tank info box
    //                               tank.batch.id = batch.id;
    //                               tank.batch.name = batch.batch_name;
    //                               // add the recipeID to the tank info box
    //                               tank.recipe_id = batch.recipe_id;
    //                             }
    //                           }
    //                           for (let recipeHistory of recipeResponse.body) {
    //                             if (tank.recipe_id === recipeHistory.id)
    //                               tank.airplane_code = recipeHistory.airplane_code;
    //                           }

    //                           //keep track of most recent date with a starting low value
    //                           var max = moment('1995-07-29');

    //                           //for every data point we have in a batch
    //                           for (let batchHistory of batchContentsResponse.body) {
    //                             //if the batchID of our data point matches the batchID we are looking for
    //                             if (batchHistory.batch_id === tank.batch.id) {
    //                               //if the date is the largest, it is the most recent one
    //                               if (moment(batchHistory.updated_at) > max) {
    //                                 max = moment(batchHistory.updated_at);
    //                                 tank.pressure = batchHistory.pressure;
    //                                 tank.temperature = batchHistory.temp;
    //                               }
    //                             }
    //                           }

    //                           //find task associated with tank
    //                           for (let task of tasksResponse.body) {
    //                             if (tank.batch.id === task.batch_id) {
    //                               //if task has our batch id
    //                               tank.action_id = task.action_id; //save the asscoiated action
    //                             }
    //                           }

    //                           //find action associated with task
    //                           for (let action of actionsResponse.body) {
    //                             if (tank.action_id === action.id) {
    //                               tank.action = action.name;
    //                             }
    //                           }
    //                           // push data holder to the tanks array
    //                           this.tanks.push(tank);
    //                         }

    //                         this.tanks.sort(this.sortTanks);
    //                       },
    //                       recipeResponse => {
    //                         console.log('Response error, cant access recipes page', recipeResponse);
    //                       }
    //                     );
    //                   },
    //                   actionsResponse => {
    //                     console.log('Response error, cant access actions page', actionsResponse);
    //                   }
    //                 );
    //               },
    //               tasksResponse => {
    //                 console.log('Response error, cant access tasks page', tasksResponse);
    //               }
    //             );
    //           },
    //           tanksResponse => {
    //             console.log('Response error, cant access tanks page', tanksResponse);
    //           }
    //         );
    //         /*************************************/
    //       },
    //       batchContentsResponse => {
    //         this.debugging = 'Debugging Flag: Response error, cant access batches contents page';
    //       }
    //     );
    //   },
    //   batchResponse => {
    //     this.debugging = 'Debugging Flag: Response error, cant access batches page';
    //   }
    // );
  },
  methods: {
    showTankInfo(tankID) {
      // send us over to the tank info page and set the id on the url
      // to be the tankID that we clicked on.
      router.push({ name: 'tank-info', params: { tankID } });
    },
    sortTanks(a, b) {
      return a.tank_id - b.tank_id;
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints';

#tankInfo {
  grid-area: info;

  h2 {
    text-align: center;
  }

  #tankContents {
    max-height: 80vh;
    overflow: scroll;
    display: grid;
    justify-content: center;
    grid-gap: 10px;
    color: white;
    font-weight: 100;

    +greater-than(desktop) {
      grid-template-columns: repeat(4, 170px);
    }

    +between(laptop, desktop) {
      grid-template-columns: repeat(3, 150px);
    }

    +less-than(laptop) {
      grid-template-columns: repeat(2, 150px);
    }

    a {
      text-decoration: none;
      color: white;
    }

    .tank {
      background: Teal;
      width: 100%;
      height: 100%;

      td:nth-child(2) {
        text-align: right;
      }

      td {
        padding: 5px;
      }
    }

    .CAP {
      background: Orange;
    }

    .COOL {
      background: Brown;
    }

    .CRASH {
      background: green;
    }

    .broken {
      background: Red;
    }

    .busy {
      background: #c9c200;
    }
  }
}
</style>
