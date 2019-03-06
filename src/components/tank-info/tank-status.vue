<template>
  <table class="table">
    <tbody>
      <tr
        scope="row"
        v-if="tankInfo.action !== '' && tankInfo.action !== 'No Action'"
        class="important"
      >
        <td>Action</td>
        <td>{{ tankInfo.action }}</td>
      </tr>
      <tr v-if="task && task.exception_reason" class="important">
        <td>Exception Reason</td>
        <td>{{ this.task.exception_reason }}</td>
      </tr>
      <tr>
        <td>Status</td>
        <td>{{ tankInfo.status }}</td>
      </tr>
      <tr>
        <td>Brand ID</td>
        <td>{{ tankInfo.recipe_id }}</td>
      </tr>
      <tr>
        <td>Batch Name</td>
        <td>{{ tankInfo.batch_name }}</td>
      </tr>
      <tr>
        <td>Generation</td>
        <td>{{ tankInfo.generation }}</td>
      </tr>
      <tr>
        <td>Volume</td>
        <td>{{ tankInfo.volume }}</td>
      </tr>
      <tr>
        <td>Bright</td>
        <td>{{ tankInfo.bright }}</td>
      </tr>
      <tr>
        <td>Temperature</td>
        <td>{{ tankInfo.temp }}º F</td>
      </tr>
      <tr>
        <td>Specific Gravity</td>
        <td>{{ tankInfo.SG }}</td>
      </tr>
      <tr>
        <td>pH</td>
        <td>{{ tankInfo.pH }}</td>
      </tr>
      <tr>
        <td>Pressure</td>
        <td>{{ tankInfo.pressure }}</td>
      </tr>
      <tr>
        <td>ABV</td>
        <td>{{ tankInfo.ABV }}%</td>
      </tr>
      <tr>
        <td>Time Last Updated</td>
        <td>{{ tankInfo.time }}</td>
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
  props: ['tankInfo', 'task']
});
</script>

<style lang="stylus" scoped>

.important
  color red
  font-weight bold
</style>
