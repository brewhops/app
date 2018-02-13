<template>
  <div>
    <div class="header">
       <router-link to="/">Logout </router-link>
      <h2>Home</h2>
    </div>
    <div id="content">
      <data-entry></data-entry>
      <tank-monitoring></tank-monitoring>
    </div>
  </div>
</template>

<script>

import dataEntry from './data-entry.vue'
import tankMonitoring from './tank-monitoring.vue'

export default {
  name: 'home',
  components: {
    'data-entry': dataEntry,
    'tank-monitoring': tankMonitoring
  },
  data() {
    return {};
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'


#content
  display grid
  grid-template-columns 1fr 1fr
  grid-template-areas "entry info"
  +less-than(laptop)
    grid-template-columns 98vw
    grid-template-areas "entry" "info"
  justify-items center

</style>
