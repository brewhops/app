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

    <div>
      <p>{{ feedback.server.tank }}</p>
    </div>
    <button v-on:click="tank_submit">Submit</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, BrewhopsCookie } from '@/types/index';

interface ICreateTankState {
  tank_name: string;
  status: string;
  in_use: boolean;
  feedback: {
    tank_name: string;
    server: {
      tank: string;
    };
  };
}

// tslint:disable: no-console

export default Vue.extend({
  name: 'create-tank',
  props: ['tanks', 'statuses', 'client_id', 'token'],
  data(): ICreateTankState {
    return {
      tank_name: '',
      status: '',
      in_use: false,
      feedback: {
        tank_name: '',
        server: {
          tank: ''
        }
      }
    };
  },
  methods: {
    async tank_submit() {
      const tankExists = this.tanks.filter((tank: Tank) => tank.name === this.tank_name);

      if (tankExists.length === 0) {
        const tank: Tank = {
          client_id: this.client_id,
          name: this.tank_name,
          status: this.status,
          in_use: this.in_use
        };

        const headers = {
          Authorization: `Bearer ${this.token}`
        };

        try {
          const response = await this.$http.post(`${process.env.VUE_APP_API}/tanks/`, tank, {
            headers
          });
          if (response.ok) {
            this.feedback.server.tank = `Tank ${this.tank_name} succesfully created.`;
            setTimeout(async () => (this.feedback.server.tank = ``), 5000);
          }
          this.$emit('update');
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
