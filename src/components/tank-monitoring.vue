<template>
  <div>
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

            <div v-if="tank.action && tank.action !== 'No Action'" class="tank-action">
              {{ tank.action }}
            </div>
          </div>
        </a>
      </div>
      <div v-else class="text-center">
        No tanks exist yet
      </div>
      <bulk-entry v-bind:tanks="tanks" />
    </div>
    <div v-else class="center">
      <loader></loader>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '@/router';
import loader from './loader.vue';
import bulkEntry from './bulk-entry.vue';
import Cookie from 'js-cookie';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';
import { orderBy } from 'natural-orderby';

import {
  Action,
  Batch,
  Recipe,
  Tank,
  Task,
  Version,
  BrewhopsCookie,
  BatchUpdateOrCreate
} from '@/types/index';
import { HttpResponse } from 'vue-resource/types/vue_resource';

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

// tslint:disable:no-any no-console
interface IDataEntryState {
  pH: string;
  ABV: string;
  SG: string;
  id: string;
  temp: string;
  time: string;
  update?: any;
}

interface ITankMonitoringState {
  tanks?: ITank[];
  file?: any;
  goal_time?: string;
  //alcolyzerData?: IDataEntryState[];
}

export default Vue.extend({
  name: 'tank-monitoring',
  components: {
    loader,
    bulkEntry,
    Datepicker
  },
  data(): ITankMonitoringState {
    return {
      tanks: undefined,
      goal_time: undefined
      // contents of a square is tankName, pressure, recipeName, temperature, batchNumber, Status
    };
  },
  // tslint:disable-next-line:max-func-body-length
  async beforeMount() {
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    this.file = null;

    try {
      const data: HttpResponse[] = await Promise.all([
        this.$http.get(`${process.env.VUE_APP_API}/tanks`),
        this.$http.get(`${process.env.VUE_APP_API}/batches`),
        this.$http.get(`${process.env.VUE_APP_API}/actions`),
        this.$http.get(`${process.env.VUE_APP_API}/recipes`)
      ]);
      const [tanksResponse, batchResponse, actionsResponse, recipeResponse] = data;

      const tanks: Tank[] = orderBy(tanksResponse.data as Tank[], (t: Tank) => t.name, 'asc');

      this.tanks = await Promise.all(
        tanks.map((tankInfo: Tank) =>
          this.createTankModel(
            tankInfo,
            batchResponse.data as Batch[],
            recipeResponse.data as Recipe[],
            actionsResponse.data as Action[]
          )
        )
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  },
  methods: {
    showTankInfo(tankID: any) {
      // send us over to the tank info page and set the id on the url
      // to be the tankID that we clicked on.
      router.push({ name: 'tank-info', params: { tankID } });
    },
    async createTankModel(
      tankInfo: Tank,
      batches: Batch[],
      recipes: Recipe[],
      actions: Action[]
    ): Promise<ITank> {
      // create a temporary tank for us to fill with data
      const tank: ITank = {
        // keep track of tank id for searching
        id: Number(tankInfo.id),
        // keep track of tank name for displaying
        name: tankInfo.name,
        status: tankInfo.status
      };

      // Get batch information
      const batch: Batch = batches
        .filter((b: Batch) => b.completed_on === null && b.tank_id === tankInfo.id)
        .sort((a: Batch, b: Batch) => {
          return moment.utc(b.started_on).diff(moment.utc(a.started_on));
        })[0];

      if (batch) {
        tank.batch = {};
        tank.batch.tank_id = tank.id;
        // add in our batchesID to the tank info box
        tank.batch.id = batch.id;
        tank.batch.name = batch.name;
        // add the recipeID to the tank info box
        tank.recipe_id = batch.recipe_id;
        tank.batch.recipe_id = batch.recipe_id;

        tank.batch.volume = batch.volume;
        tank.batch.bright = batch.bright;
        tank.batch.generation = batch.generation;

        // Set recipe information
        for (const recipe of recipes) {
          if (batch.recipe_id === recipe.id) {
            tank.airplane_code = recipe.airplane_code;
          }
        }

        // Get version information if tank is in use
        if (tankInfo.in_use) {
          const versionsResponse = await this.$http.get(
            `${process.env.VUE_APP_API}/versions/batch/${batch.id}`
          );
          const versions: Version[] = (versionsResponse.data as Version[])
            .map((v: Version) => {
              v.measured_on = moment(v.measured_on);

              return v;
            })
            .sort((a: Version, b: Version) => {
              return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
            });

          if (versions.length > 0) {
            const lastVersion = versions[versions.length - 1];

            tank.pressure = lastVersion.pressure;
            tank.temperature = lastVersion.temperature;
          }
        }

        // Get task information
        const tasksResponse = await this.$http.get(
          `${process.env.VUE_APP_API}/tasks/batch/${batch.id}`
        );
        const activeTasks: Task[] = (tasksResponse.data as Task[]).filter(
          (t: Task) => !t.completed_on
        );

        if (activeTasks.length > 0) {
          const task: Task = activeTasks[0];
          tank.action_id = task.action_id;

          // Set action data
          for (const action of actions) {
            if (tank.action_id === action.id) {
              tank.action = action.name;
              tank.action_id = action.classname;
            }
          }
        }
      }

      // return tank
      return tank;
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

.text-center
  text-align center

.dataEntry {
  padding 15px
  grid-area entry
  display flex
  justify-content center
  align-items center
}

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
    font-weight: 300;
    margin: 5px;
    grid-auto-rows: minmax(128px, max-content);

    +greater-than(desktop) {
      grid-template-columns: repeat(4, 250px);
    }

    +between(laptop, desktop) {
      grid-template-columns: repeat(4, 220px);
    }

    +less-than(laptop) {
      grid-template-columns: repeat(3, 200px);
    }

    +less-than(tablet) {
      grid-template-columns: repeat(2, 200px);
    }

    +less-than(mobile) {
      grid-template-columns: repeat(1, 250px);
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

    .primary-fermentation {
      background: White;
      color: Black;
      border: 1px solid Black;
    }

    .primary-adjunct-add {
      background: rgb(255, 255, 255);
      color: Black;
      border: 1px solid Black;
    }

    .free-rise {
      background: rgb(247, 203, 175);
      color: Black;
    }

    .cap {
      background: rgb(255, 253, 56);
      color: Black;
    }

    .adjunct-add  {
      background: rgb(148, 206, 88);
      color: Black;
    }

    .exception {
      background: Red;
      color: White;
    }

    .wait-for-diacetyl {
      background: rgb(253, 191, 45);
      color: Black;
    }

    .crashed {
      background: rgb(29, 177, 237);
      color: Black;
    }

    .yeast-pull {
      background: rgb(127, 95, 17);
      color: rgb(253, 251, 55);
    }

    .no-action {
      background: Teal
      color: White
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
