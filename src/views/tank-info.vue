<template>
  <div>
    <div class="title">
      <h3>Tank {{ tankInfo.name }}</h3>
    </div>
    <div v-if="tank && this.tank.in_use && recipe && batch" id="content">
      <div id="info-content">
        <div id="tank">
          <h2>Info</h2>
          <tank-status v-bind:tankInfo="tankInfo" v-bind:task="task" />
          <recipe id="recipe" v-bind:recipe="recipe" v-bind:volume="tankInfo.volume" />
        </div>

        <div id="entry">
          <update-action
            v-bind:tank="tank"
            v-bind:batch="batch"
            v-bind:activeTask="task"
            @newDataCallback="loadData"
          ></update-action>
          <data-entry
            v-bind:tank="tank"
            v-bind:batch="batch"
            v-bind:recipe="recipe"
            v-bind:activeTask="task"
            @newDataCallback="loadData"
          ></data-entry>
        </div>
      </div>
      <div v-show="versions.length > 0" id="data">
        <h2>Batch History</h2>
        <div id="charts">
          <chart
            class="chart"
            v-bind:title="'pH'"
            v-bind:date="pHData.map(elm => elm.date)"
            v-bind:data="pHData.map(elm => elm.data)"
          />
          <chart
            class="chart"
            v-bind:title="'ABV'"
            v-bind:date="abvData.map(elm => elm.date)"
            v-bind:data="abvData.map(elm => elm.data)"
          />
          <chart
            class="chart"
            v-bind:title="'SG'"
            v-bind:date="fermentationData.map(elm => elm.date)"
            v-bind:data="fermentationData.map(elm => elm.data)"
          />
          <chart
            class="chart"
            v-bind:title="'Temperature'"
            v-bind:date="tempData.map(elm => elm.date)"
            v-bind:data="tempData.map(elm => elm.data)"
          />
        </div>
      </div>
    </div>
    <div v-if="tank && !this.tank.in_use" id="new-batch">
      <new-batch :tank="this.tank" />
    </div>
    <div v-if="!tank && !recipe && !batch" class="center">
      <loader></loader>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import recipe from '@/components/tank-info/recipe.vue';
import chart from '@/components/chart.vue';
import dataEntry from '@/components/tank-info/data-entry.vue';
import newBatch from '@/components/tank-info/new-batch.vue';
import updateAction from '@/components/tank-info/update-action.vue';
import tankStatus from '@/components/tank-info/tank-status.vue';
import loader from '@/components/loader.vue';
import router from '@/router';
import Cookie from 'js-cookie';

import moment, { unix, months, Moment } from 'moment';
import { Batch, Tank, Task, Action, Version, Recipe } from '@/types/index';

// tslint:disable: no-any
interface ITankInfoState {
  tankInfo: any;
  batch?: Batch;
  versions: Version[];
  tank?: Tank;
  task?: Task;
  recipe?: Recipe;
  action?: Action;
  doneLink?: any;
  home?: any;
  debugging?: string;
  fermentationData: any[];
  pHData: any[];
  abvData: any[];
  tempData: any[];
}

export default Vue.extend({
  name: 'tank-info',
  components: {
    recipe,
    chart,
    dataEntry,
    newBatch,
    tankStatus,
    updateAction,
    loader
  },
  data(): ITankInfoState {
    return {
      tankInfo: {
        id: Number(this.$route.params.tankID),
        recipe_id: undefined,
        batch_id: undefined,
        batch_name: '',
        volume: '',
        bright: '',
        generation: '',
        SG: '',
        pH: '',
        ABV: '',
        temp: '',
        status: '',
        time: '',
        name: '',
        action: '',
        in_use: undefined
      },
      doneLink: '',
      home: '',
      debugging: '',
      tank: undefined,
      task: undefined,
      batch: undefined,
      versions: [],
      fermentationData: [],
      pHData: [],
      abvData: [],
      tempData: [],
      recipe: undefined,
      action: undefined
    };
  },
  // tslint:disable-next-line:max-func-body-length
  async beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    this.doneLink = '/home';
    this.home = '/home';

    try {
      const response = await this.$http.get(
        `${process.env.VUE_APP_API}/tanks/id/${this.$route.params.tankID}`
      );
      const tank: Tank = response.data as Tank;
      this.tank = tank;
      this.tankInfo = {
        ...this.tankInfo,
        id: tank.id,
        name: tank.name,
        status: tank.status,
        in_use: tank.in_use
      };
      await this.loadData();
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.debugging = 'Debugging Flag: Response error, cant access tanks page';
    }
  },
  methods: {
    getData(key: string, title?: string) {
      return [
        [
          title === undefined && this.batch ? this.batch.name : title,
          ...this.versions.map((v: Version) => v[key])
        ]
      ];
    },
    async loadData() {
      try {
        await this.loadBatchData();
        const methods = await Promise.all([
          this.loadTaskData(),
          this.loadHistoryData(),
          this.loadGraphData(
            this.batch ? this.batch.id : undefined,
            this.batch ? this.batch.recipe_id : undefined
          )
        ]);
      } catch (err) {
        console.error(err);
      }
    },
    async loadBatchData() {
      try {
        const response = await this.$http.get(
          `${process.env.VUE_APP_API}/batches/tank/${this.tankInfo.id}`
        );

        const openBatches: Batch[] = (response.data as Batch[]).filter(
          (b: Batch) => b.completed_on === null
        );

        let batch: Batch | undefined;
        if (openBatches.length > 1) {
          this.debugging = 'Debugging Flag: more than one open batch';

          // Use the most recently opened batch
          batch = openBatches.sort((a: Batch, b: Batch) => {
            return moment.utc(b.started_on).diff(moment.utc(a.started_on));
          })[0];
        } else if (openBatches.length === 1) {
          // Found only open batch
          batch = openBatches[0];
        }

        // Set the current batch
        this.batch = batch;

        if (batch) {
          // Populate the view model
          this.tankInfo.batch_id = batch.id;
          this.tankInfo.batch_name = batch.name;
          this.tankInfo.bright = batch.bright;
          this.tankInfo.generation = batch.generation;
          this.tankInfo.volume = batch.volume;
          this.tankInfo.recipe_id = batch.recipe_id;
        } else {
          // Update the view model
          this.tankInfo.batch_id = '';
          this.tankInfo.batch_name = '';
          this.tankInfo.bright = '';
          this.tankInfo.generation = '';
          this.tankInfo.volume = '';
          this.tankInfo.recipe_id = '';
        }

        let recipe: Recipe | undefined;
        if (batch) {
          // Get the recipe
          const recipeResponse = await this.$http.get(
            `${process.env.VUE_APP_API}/recipes/id/${batch.recipe_id}`
          );
          recipe = recipeResponse.data;
        }

        this.recipe = recipe;
      } catch (err) {
        this.debugging = 'Debugging Flag: Response error, cant access batches page';
      }
    },
    async loadTaskData() {
      if (this.batch) {
        try {
          const response = await this.$http.get(
            `${process.env.VUE_APP_API}/tasks/batch/${this.batch.id}`
          );
          const batchTasks: Task[] = response.data as Task[];

          const activeTasks: Task[] = batchTasks.filter((t: Task) => !t.completed_on);

          let task: Task | undefined;
          if (activeTasks.length > 1) {
            this.debugging = 'Debugging Fal: more than one active task for batch';

            // Use the most recently opened task
            task = activeTasks.sort((a: Task, b: Task) => {
              return moment.utc(b.added_on).diff(moment.utc(a.added_on));
            })[0];
          } else if (activeTasks.length === 1) {
            // Only one active task
            task = activeTasks[0];
          }

          this.task = task;

          let action: Action | undefined;
          if (task) {
            // get the action name associated with the task
            const actionResponse = await this.$http.get(
              `${process.env.VUE_APP_API}/actions/id/${task.action_id}`
            );
            action = actionResponse.data as Action;

            this.tankInfo.action = action.name;
            this.tankInfo.time = moment(task.added_on).format('MM/DD/YY H:mm');
          } else {
            this.tankInfo.action = '';
          }

          this.action = action;
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
        }
      }
    },
    async loadHistoryData() {
      if (this.batch) {
        try {
          const response = await this.$http.get(
            `${process.env.VUE_APP_API}/versions/batch/${this.tankInfo.batch_id}`
          );

          this.versions = [];
          this.versions = (response.data as Version[])
            .map((v: Version) => {
              v.measured_on = moment(v.measured_on);

              return v;
            })
            .sort((a: Version, b: Version) => {
              return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
            });

          if (this.versions.length > 0) {
            // Set current data
            const lastVersion = this.versions[this.versions.length - 1];

            this.tankInfo.ABV = lastVersion.abv;
            this.tankInfo.pH = lastVersion.ph;
            this.tankInfo.temp = lastVersion.temperature;
            this.tankInfo.SG = lastVersion.sg;
            this.tankInfo.pressure = lastVersion.pressure;
            // use a lowercase h to change the hours from 24 to 12
            // the mm sets the minute with a leading 0
            this.tankInfo.time = (lastVersion.measured_on as Moment).format('MM/DD/YY H:mm');
          } else {
            this.tankInfo.ABV = '';
            this.tankInfo.pH = '';
            this.tankInfo.temp = '';
            this.tankInfo.SG = '';
            this.tankInfo.pressure = '';
          }
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
        }
      }
    },
    async loadGraphData(batchId: any, recipeId: any) {
      let previousBatches: Batch[] = [];
      try {
        const { data } = await this.$http.get(
          `${process.env.VUE_APP_API}/batches/recipe/${recipeId}`
        );
        previousBatches = <Batch[]>data.sort((a: Batch, b: Batch) => {
          return moment.utc(b.started_on).diff(moment.utc(a.started_on));
        });
      } catch (err) {
        console.error(err);
      }

      let currentBatchIdx: any;
      previousBatches.some((b, i) => {
        currentBatchIdx = i;

        return b.id === batchId;
      });

      previousBatches = previousBatches.splice(currentBatchIdx, 10);

      const startDate = this.batch ? moment(this.batch.started_on) : undefined;

      let formattedData: any[] = [];

      try {
        formattedData = await Promise.all(
          previousBatches.map(async (batch, i) => {
            const response = await this.$http.get(
              `${process.env.VUE_APP_API}/versions/batch/${batch.id}`
            );

            const versions = (response.data as Version[])
              .map((v: Version) => {
                v.measured_on = moment(v.measured_on);

                return v;
              })
              .sort((a: Version, b: Version) => {
                return moment.utc(a.measured_on).diff(moment.utc(b.measured_on));
              });

            const sg = versions.map(v => v.sg);
            const ph = versions.map(v => v.ph);
            const abv = versions.map(v => v.abv);
            const temp = versions.map(v => v.temperature);

            const date = versions.map(v => v.measured_on) as Moment[];
            const days = date.map(d =>
              moment(startDate).add(moment.duration(d.diff(date[0])).asMilliseconds(), 'ms')
            );

            return {
              sg: {
                data: [batch.name, ...sg],
                date: [`Days${i}`, ...days]
              },
              ph: {
                data: [batch.name, ...ph],
                date: [`Days${i}`, ...days]
              },
              abv: {
                data: [batch.name, ...abv],
                date: [`Days${i}`, ...days]
              },
              temp: {
                data: [batch.name, ...temp],
                date: [`Days${i}`, ...days]
              }
            };
          })
        );
      } catch (err) {
        console.error(err);
      }

      this.fermentationData = formattedData.map((e: any) => e.sg);
      this.pHData = formattedData.map((e: any) => e.ph);
      this.abvData = formattedData.map((e: any) => e.abv);
      this.tempData = formattedData.map((e: any) => e.temp);
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints';

.title {
  display: flex;
  width: 100vw;
  justify-content: center;
  align-items: center;
}

.center {
  display: flex;
  width: 100vw;
  height: 90vh;
  justify-content: center;
  align-items: center;
}

#info-content {
  display: grid;
  grid-template-columns: 45vw 45vw;
  grid-template-areas: 'tank entry';
  width: 90vw;
  margin: auto;

  +less-than(tablet) {
    grid-template-columns: 90vw;
    grid-template-areas: 'tank' 'entry' 'recipe';
  }

  +less-than(mobile) {
    grid-template-columns: 90vw;
    grid-template-areas: 'tank' 'recipe';
  }
}

#new-batch {
  display: grid;
  grid-template-columns: auto;
  justify-content: center;
  margin: auto;
  margin-top: 30px;
}

#recipe {
  margin-top: 30px;
}

#entry {
  +less-than(tablet) {
    margin: auto;
  }
}

#data {
  justify-content: center;
  width: 90vw;
  margin: auto;
  margin-top: 30px;

  #charts {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, 43vw);

    +less-than(tablet) {
      grid-template-columns: 90vw;
    }

    .chart {
      margin-left: 1vw;
      margin-right: 1vw;
    }
  }

  h2 {
    text-align: center;
  }
}

#entry {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#tank {
  text-align: center;
  justify-content: center;
  padding: 15px;

  table {
    text-align: left;
    margin: auto;
    margin-top: 30px;
  }

  h2, h3, h4 {
    text-align: center;
  }

  grid-area: tank;
}
</style>
