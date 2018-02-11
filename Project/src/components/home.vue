<template>
  <div>
    <div class="header">
       <router-link to="/">Logout </router-link>
      <h2>Home</h2>
    </div>
    <div id="content">
      <data-entry></data-entry>
      <tank-info></tank-info>
    </div>
  </div>
</template>

<script>

import DataEntry from './data-entry.vue'
import TankInfo from './tank-info.vue'

export default {
  name: 'home',
  components: {
    'data-entry': DataEntry,
    'tank-info': TankInfo
  },
  data() {
    return {};
  }
};
</script>

<style lang="stylus" scoped>
small = 320px;
mobile = 480px;
tablet = 768px;
laptop = 1024px;
desktop = 1280px;

less-than(size)
  @media screen and (max-width: size)
    {block}

greater-than(size)
  @media screen and (min-width: size)
    {block}

between(size1, size2)
  @media screen and (min-width: size1) and (max-width: size2)
    {block}


#content
  display grid
  grid-template-columns 1fr 1fr
  grid-template-areas "entry info"
  +less-than(laptop)
    grid-template-columns 98vw
    grid-template-areas "entry" "info"
  justify-items center

</style>
