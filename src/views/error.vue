<template>
  <div>
    <div id="content">
      Not Found...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'error'
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints';

#content {
  display grid
  padding-top 2em
  font-size 3em

  +greater-than(desktop) {
    grid-template-columns: 1fr;
  }

  grid-template-columns: 1fr;
  grid-template-areas: 'info';

  +less-than(tablet) {
    grid-template-columns: 98vw;
    grid-template-areas: 'info';
  }

  justify-items center
}
</style>
