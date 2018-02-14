<template>
<div id="dataEntry">
  <h2>Data Entry</h2>
  <input type="text" placeholder="Tank Number">
  <input type="text" placeholder="Tank Status">
  <input type="text" placeholder="Specific Gravity">
  <div class="inline">
    <input type="text" placeholder="pH">
    <input type="text" placeholder="ABV">
    <input type="text" placeholder="Temp">
  </div>
  <input type="text" placeholder="Volume">
  <input type="text" placeholder="Generation">
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
  width 95vw
  margin auto
  max-width 500px
  h2
    padding 2vh
    margin 0
  .inline
    input
      width 32%
</style>
