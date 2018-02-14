<template>
<div id="dataEntry">
  <h2>Data Entry</h2>
  <input type="text" placeholder="Tank Number">
  <input type="text" placeholder="Tank Status">
  <input type="number" placeholder="Specific Gravity">
  <div class="inline">
    <input type="number" placeholder="pH">
    <input type="number" placeholder="ABV">
    <input type="number" placeholder="Temp">
  </div>
  <input type="number" placeholder="Volume">
  <input type="number" placeholder="Generation">
  <input type="datetime-local" placeholder="Time Measured">
  <input type="text" placeholder="Brand ID">
  <input type="text" placeholder="Batch Number">
  <input type="text" placeholder="Action Needed">
  <router-link to="/data-submission"><button>Submit</button></router-link>
</div>
</template>

<script>
export default {
  name: 'data-entry',
  data() {
    return {
      msg: ''
    };
  }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#dataEntry
  grid-area entry
  display flex
  flex-direction column
  align-items center
  +less-than(tablet)
    width 95vw
  margin auto
  min-width 350px
  max-width 500px
  .inline
    input
      width 32%
</style>
