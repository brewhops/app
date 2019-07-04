<template lang="html">
  <div>
    <p>{{ title }}</p>
    <table>
      <tr>
        <th v-for="header in headers">{{ header }}</th>
      </tr>
      <tr v-for="d in data">
        <td v-for="f in fields">{{ f(d) }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'data-table',
  props: ['title', 'data', 'headers', 'fields']
});
</script>

<style lang="stylus" scoped>
p
  color Black
  font-weight bold


table {
  border-collapse: collapse;
  border: 1px solid black;
  tr {
    td, th {
      padding: 10px;
      border-left: 1px solid black;
    }
  }
}
</style>
