<template>
  <table class="table">
    <tbody>
      <tr scope="row" v-if="this.tankInfo.action !== ''" class="important">
        <td>Action</td>
        <td>{{ this.tankInfo.action }}</td>
      </tr>
      <tr>
        <td>Status</td>
        <td>{{ this.tankInfo.status }}</td>
      </tr>
      <tr>
        <td>Brand ID</td>
        <td>{{ this.tankInfo.recipe_id }}</td>
      </tr>
      <tr>
        <td>Batch Name</td>
        <td>{{ this.tankInfo.batch_name }}</td>
      </tr>
      <tr>
        <td>Generation</td>
        <td>{{ this.tankInfo.generation }}</td>
      </tr>
      <tr>
        <td>Volume</td>
        <td>{{ this.tankInfo.volume }}</td>
      </tr>
      <tr>
        <td>Bright</td>
        <td>{{ this.tankInfo.bright }}</td>
      </tr>
      <tr>
        <td>Temperature</td>
        <td>{{ this.tankInfo.temp }}º F</td>
      </tr>
      <tr>
        <td>Specific Gravity</td>
        <td>{{ this.tankInfo.SG }}</td>
      </tr>
      <tr>
        <td>pH</td>
        <td>{{ this.tankInfo.pH }}</td>
      </tr>
      <tr>
        <td>Pressure</td>
        <td>{{ this.tankInfo.pressure }}</td>
      </tr>
      <tr>
        <td>ABV</td>
        <td>{{ this.tankInfo.ABV }}%</td>
      </tr>
      <tr>
        <td>Time Last Updated</td>
        <td>{{ this.tankInfo.time }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';

import moment, { unix, months, Moment } from 'moment';

// tslint:disable: no-any
interface ITankStatusState {}

export default Vue.extend({
  name: 'tank-status',
  props: ['tankInfo']
});
</script>

<style lang="stylus" scoped>

.important
  color red
  font-weight bold
</style>
