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
      <tr class="important">
        <td>Action Updated On</td>
        <td>{{ this.tankInfo.actionTime }}</td>
      </tr>
      <tr v-if="this.tankInfo && this.tankInfo.actionExceptionReason" class="important">
        <td>Exception Reason</td>
        <td>{{ this.tankInfo.actionExceptionReason }}</td>
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
        <td>Data Updated On</td>
        <td>{{ this.tankInfo.time }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';

import moment, { unix, months, Moment } from 'moment';

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
