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

    <button v-on:click="tank_update">Submit</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, BrewhopsCookie } from '../../types';

interface IUpdateTankState {
  tank_name: string;
  status: string;
}

// tslint:disable: no-console

export default Vue.extend({
  name: 'create-tank',
  props: ['tanks', 'statuses'],
  data(): IUpdateTankState {
    return {
      tank_name: '',
      status: ''
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
          await this.$http.patch(`${process.env.API}/tanks/id/${id}`, tank, { headers });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
});
</script>

<style lang="stylus" scoped></style>
