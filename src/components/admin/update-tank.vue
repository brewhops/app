<template>
  <div class="element">
    <h2>Update Tank Status</h2>
    <select v-model="tank_name" class="dropdown">
      <option disabled value="">Tank Number</option>
      <option v-for="tank in tanks" v-bind:key="tank.id" :value="tank.id">{{ tank.name }}</option>
    </select>

    <select v-model="status" class="dropdown">
      <option disabled value="">Status on Tank</option>
      <option v-for="status in statuses" v-bind:key="status" :value="status">{{ status }}</option>
    </select>

    <div>
      <p>{{ feedback.server.tank }}</p>
    </div>
    <button v-on:click="tank_update">Submit</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, BrewhopsCookie } from '../../types';
import { emit } from 'cluster';

interface IUpdateTankState {
  tank_name: string;
  status: string;
  feedback: {
    server: {
      tank: string;
    };
  };
}

// tslint:disable: no-console

export default Vue.extend({
  name: 'create-tank',
  props: ['tanks', 'statuses'],
  data(): IUpdateTankState {
    return {
      tank_name: '',
      status: '',
      feedback: {
        server: {
          tank: ''
        }
      }
    };
  },
  methods: {
    async tank_update() {
      const currentTank: Tank = this.tanks.filter((tank: Tank) => tank.name === this.tank_name);

      if (currentTank) {
        const { id, name, status } = currentTank;
        const tank = {
          name,
          status
        };

        const headers = {
          Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
        };

        try {
          const response = await this.$http.patch(`${process.env.API}/tanks/id/${id}`, tank, {
            headers
          });
          if (response.ok) {
            this.feedback.server.tank = `Tank ${this.tank_name} succesfully updated.`;
            setTimeout(async () => (this.feedback.server.tank = ``), 5000);
          }
          this.$emit('update');
        } catch (err) {
          console.error(err);
          this.feedback.server.tank = `Failed to update ${this.tank_name}.`;
        }
      }
    }
  }
});
</script>

<style lang="stylus" scoped></style>
