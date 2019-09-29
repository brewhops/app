<template>
  <div v-if="!tank" class="element paper">
    <h2>Edit Tank</h2>
    <select v-model="tank_id" v-on:change="populateTank" class="dropdown">
      <option disabled value="">Select Tank</option>
      <option v-for="tank in tanks" v-bind:key="tank.id" :value="tank.id">{{ tank.name }}</option>
    </select>
  </div>
  <div v-else class="element paper">
    <h2>Edit {{ this.tank.name }}</h2>
    <input v-model="tank_name" placeholder="Tank Name" type="string" />
    <select v-model="status" class="dropdown">
      <option disabled value="">Status on Tank</option>
      <option v-for="status in statuses" v-bind:key="status" :value="status">{{ status }}</option>
    </select>
    <div>
      <p>{{ feedback.server.tank }}</p>
    </div>
    <button v-on:click="tankUpdate">Submit</button>
    <button v-on:click="clearTank">Select a Tank</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, BrewhopsCookie } from '@/types/index';

interface IUpdateTankState {
  tank?: Tank;
  tank_id: string;
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
  name: 'edit-tank',
  props: ['tanks', 'statuses'],
  data(): IUpdateTankState {
    return {
      tank: undefined,
      tank_id: '',
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
    async tankUpdate() {
      if (this.tank) {
        const { id } = this.tank;
        const tank = {
          name: this.tank_name,
          status: this.status,
          update_user: Cookie.getJSON('loggedIn').id
        };

        try {
          const response = await this.$http.patch(
            `${process.env.VUE_APP_API}/tanks/id/${id}/`,
            tank
          );
          if (response.ok) {
            this.feedback.server.tank = `Tank ${name} succesfully updated.`;
            setTimeout(async () => {
              this.feedback.server.tank = ``;
              this.clearTank();
            }, 5000);
          }
          this.$emit('update');
        } catch (err) {
          console.error(err);
          this.feedback.server.tank = `Failed to update ${name}.`;
        }
      }
    },
    populateTank() {
      if (this.tank_id) {
        this.tank = this.tanks.filter((tank: Tank) => tank.id === parseInt(this.tank_id, 10))[0];
        if (this.tank) {
          const { name, status } = this.tank;
          this.status = status;
          this.tank_name = name;
        }
      }
    },
    clearTank() {
      this.tank = undefined;
      this.tank_id = '';
    }
  }
});
</script>

<style lang="stylus" scoped></style>
