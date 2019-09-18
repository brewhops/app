<template lang="html">
  <div>
    <h5>{{ title }}</h5>
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
@import '../styles/colors'

table
  margin auto
  border-collapse collapse
  margin 10px auto
  th, td
    padding 10px
  th
    background darken(Teal, 20%)
    color white
    border-bottom 1px solid black
  tr:nth-child(odd)
    background hsl(TealH, TealS - (lightness(Teal) / .8), TealL + 40)
  tr:nth-child(even)
    background lighten(Teal, 80%)
</style>
