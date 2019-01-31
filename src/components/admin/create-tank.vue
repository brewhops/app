<template>
  <div class="element">
    <h2>Create New Tank</h2>
    <input v-model.lazy="tank_name" placeholder="New Tank Number" />
    <span>{{ feedback.tank_name }}</span>

    <select v-model="status" class="dropdown">
      <option disabled value="">Status on Tank</option>
      <option v-for="status in statuses" v-bind:key="status" :value="status">{{ status }}</option>
    </select>

    <div class="checkbox">
      <input type="checkbox" id="checkbox" v-model="in_use" />
      <p>Tank is in use</p>
    </div>

    <button v-on:click="tank_submit">Submit</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, BrewhopsCookie } from '../../types';

interface ICreateTankState {
  tank_name: string;
  status: string;
  in_use: boolean;
  feedback: {
    tank_name: string;
  };
}

// tslint:disable: no-console

export default Vue.extend({
  name: 'create-tank',
  props: ['tanks', 'statuses'],
  data(): ICreateTankState {
    return {
      tank_name: '',
      status: '',
      in_use: false,
      feedback: {
        tank_name: ''
      }
    };
  },
  methods: {
    async tank_submit() {
      const tankExists = this.tanks.filter((tank: Tank) => tank.name === this.tank_name);

      if (tankExists.length === 0) {
        const tank: Tank = {
          name: this.tank_name,
          status: this.status,
          in_use: this.in_use
        };

        const headers = {
          Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
        };

        try {
          await this.$http.post(`${process.env.API}/tanks`, tank, { headers });
        } catch (err) {
          console.error(err);
        }
      } else {
        this.feedback.tank_name = `Tank ${this.tank_name} already exists.`;
      }
    }
  }
});
</script>

<style lang="stylus" scoped></style>
