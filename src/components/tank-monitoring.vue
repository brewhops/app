<template>
  <div>
    <div class="header" v-if="mobile">
      <a v-on:click="logout">Logout</a>
      <h2>Tank Monitoring</h2>
    </div>
    <div id="tankInfo" v-if="tanks">
      <h2>Tank Info</h2>
      <div id="tankContents" v-if="tanks.length > 0">
        <a v-on:click="showTankInfo(tank.id)" v-for="tank in tanks" v-bind:key="tank.id">
          <div class="tank" v-bind:class="tank.action_id">
            <div class="tank-name">
              {{ tank.name }}
            </div>
            <table>
              <tr>
                <td v-if="tank.airplane_code">{{ tank.airplane_code }}</td>
                <td v-if="tank.pressure">{{ tank.pressure }} psi</td>
                <td v-else>{{ tank.status }}</td>
              </tr>
              <tr>
                <td v-if="tank.batch">{{ tank.batch.name }}</td>
                <td v-if="tank.temperature">{{ tank.temperature }}ºF</td>
              </tr>
            </table>

            <div v-if="tank.action" class="tank-action">
              {{ tank.action }}
            </div>
          </div>
        </a>
      </div>
      <div v-else class="center">
        No tanks exist
      </div>
    </div>
    <div v-else class="center">
      <loader></loader>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router';
import loader from './loader.vue';
import { logout } from '../utils';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Action, Batch, Recipe, Tank, Task, Version } from '../types';

// tslint:disable: max-func-body-length no-any

interface ITank {
  action?: string;
  action_id?: number | string;
  batch?: any;
  pressure?: number;
  temperature?: number;
  recipe_id?: number;
  airplane_code?: string;
  id?: number;
  name?: string;
  status?: string;
}

interface ITankMonitoringState {
  mobile: boolean;
  tanks?: ITank[];
}

export default Vue.extend({
  name: 'tank-monitoring',
  components: {
    loader
  },
  data(): ITankMonitoringState {
    return {
      mobile: false,
      tanks: undefined
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
      const tanksResponse = await this.$http.get(`${process.env.API}/tanks`);
      const batchResponse = await this.$http.get(`${process.env.API}/batches`);
      const actionsResponse = await this.$http.get(`${process.env.API}/actions`);
      const recipeResponse = await this.$http.get(`${process.env.API}/recipes`);

      const tankModels: ITank[] = [];
      const tanks: Tank[] = (tanksResponse.data as Tank[]).sort(this.sortTanks);
      for (const tankInfo of tanks) {
        // create a temporary tank for us to fill with data
        const tank: ITank = {
          // keep track of tank id for searching
          id: Number(tankInfo.id),
          // keep track of tank name for displaying
          name: tankInfo.name,
          status: tankInfo.status
        };

        // Get batch information
        const batch: Batch = (batchResponse.data as Batch[])
          .filter((b: Batch) => b.completed_on === null && b.tank_id === tankInfo.id)
          .sort((a: Batch, b: Batch) => {
            return moment.utc(b.started_on).diff(moment.utc(a.started_on));
          })[0];

        if (batch) {
          tank.batch = {};
          // add in our batchesID to the tank info box
          tank.batch.id = batch.id;
          tank.batch.name = batch.name;
          // add the recipeID to the tank info box
          tank.recipe_id = batch.recipe_id;

          // Set recipe information
          for (const recipe of recipeResponse.data as Recipe[]) {
            if (batch.recipe_id === recipe.id) {
              tank.airplane_code = recipe.airplane_code;
            }
          }

          // Get version information if tank is in use
          if (tankInfo.in_use) {
            const versionsResponse = await this.$http.get(
              `${process.env.API}/versions/batch/${batch.id}`
            );
            const versions: Version[] = (versionsResponse.data as Version[])
              .map((v: Version) => {
                v.measured_on = moment(v.measured_on);
                return v;
              })
              .sort((a: Version, b: Version) => {
                return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
              });
            const lastVersion = versions[versions.length - 1];

            tank.pressure = lastVersion.pressure;
            tank.temperature = lastVersion.temperature;
          }

          // Get task information
          const tasksResponse = await this.$http.get(`${process.env.API}/tasks/batch/${batch.id}`);
          const activeTasks: Task[] = (tasksResponse.data as Task[]).filter(
            (t: Task) => !t.completed_on
          );

          if (activeTasks.length > 0) {
            const task: Task = activeTasks[0];
            tank.action_id = task.action_id;

            // Set action data
            for (const action of actionsResponse.data as Action[]) {
              if (tank.action_id === action.id) {
                tank.action = action.name;
                tank.action_id = `action${action.id}`;
              }
            }
          }
        }

        // push data holder to the tanks array
        tankModels.push(tank);
      }

      this.tanks = tankModels;
      this.tanks.sort(this.sortITanks);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    logout,
    showTankInfo(tankID) {
      // send us over to the tank info page and set the id on the url
      // to be the tankID that we clicked on.
      router.push({ name: 'tank-info', params: { tankID } });
    },
    sortITanks(a: ITank, b: ITank) {
      return <number>a.id - <number>b.id;
    },
    sortTanks(a: Tank, b: Tank) {
      return <number>a.id - <number>b.id;
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints';

.center
  display flex
  width 100vw
  height 90vh
  justify-content center
  align-items center

#tankInfo {
  grid-area: info;

  h2 {
    text-align: center;
  }

  #tankContents {
    display: grid;
    justify-content: center;
    grid-gap: 10px;
    color: white;
    font-weight: 100;
    grid-auto-rows: minmax(128px, max-content);

    +greater-than(desktop) {
      grid-template-columns: repeat(4, 220px);
    }

    +between(laptop, desktop) {
      grid-template-columns: repeat(3, 220px);
    }

    +less-than(laptop) {
      grid-template-columns: repeat(2, 220px);
    }

    +less-than(tablet) {
      grid-template-columns: repeat(2, 200px);
    }

    a {
      text-decoration: none;
      color: white;
    }

    .tank {
      background: Teal;
      width: 100%;
      height: 100%;
      min-height 128px;

      table {
        width: 100%;
        padding-left: 5px;
        padding-right: 7px;

        td:nth-child(2) {
          text-align: right;
        }

        td {
          padding: 3px;
        }
      }

      .tank-name {
        padding: 8px;
        font-size: 20px;
      }

      .tank-action {
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 10px;
        margin-bottom: 8px;
        text-align: center;
      }
    }

    .action1 {
      background: White;
      color: Black;
      border: 1px solid Black;
    }

    .action2 {
      background: rgb(0, 167, 255);
      color: Black;
    }

    .action3  {
      background: rgb(255, 255, 3);
      color: Black;
    }

    .action4  {
      background: rgb(224, 218, 233);
      color: Black;
    }

    .action5 {
      background: rgb(135, 201, 71);
      color: Black;
    }

    .action6 {
      background: rgb(255, 184, 2);
      color: Black;
    }

    .action7 {
      background: rgb(0, 167, 238);
      color: Black;
    }

    .action8 {
      background: rgb(255, 0, 1);
      color: Black;
    }

    .action9 {
      background: rgb(222, 96, 13);
      color: Black;
    }

    .action10 {
      background: rgb(255, 255, 3);
      color: Black;
    }

    .action11 {
      background: rgb(252, 207, 171);
      color: Black;
    }

    .action12 {
      background: rgb(128,0,128);
      color: White;
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
