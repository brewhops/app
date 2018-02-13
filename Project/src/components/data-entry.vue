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

#dataEntry
  grid-area entry
  display flex
  flex-direction column
  align-items center
  max-width 500px
  .inline
    input
      width 32%
</style>
