<template>
<div>
  <div class="header" v-if="mobile">
     <router-link to="/home-mobile">Home</router-link>
    <h2>Data Entry</h2>
  </div>
  <div id="dataEntry">
    <h2 v-if="!mobile">Data Entry</h2>
    <div id="formFields">

      <input v-model="tank_id" placeholder="Tank Number">
      <input v-model="status" placeholder="Tank Status">
      <input v-model="specificGravity" placeholder="Specific Gravity">
      <div class="inline">
        <input v-model="ph" placeholder="pH">
        <input v-model="abv" placeholder="ABV">
        <input v-model="temp" placeholder="Temp">
      </div>
      <input v-model="volume" placeholder="Volume">
      <input v-model="generation" placeholder="Generation">
      <input type="datetime-local" placeholder="Time Measured">
      <input v-model="recipe_id" placeholder="Brand ID">
      <input v-model="batchID" placeholder="Batch Number">
      <input v-model="action" placeholder="Action Needed">
    </div>
    <button v-on:click="submit">Submit</button>
  </div>
</div>
</template>

<script>

import router from "../router/index.js"

export default {
  name: 'data-entry',
  data() {
    return {
      specificGravity: '',
      tank_id: '',
      status: '',
      ph: '',
      abv: '',
      temp: '',
      volume: '',
      //bright: '',   //TODO: DO we need bright on this page?? Yes I think, ask connor for formatting
      generation: '',
      recipe_id: '',
      batchID: '',
      action: '',
      mobile: false
    };
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }
  },
  methods: {
      submit: function () {

          var formData1 = new FormData();
            //formData1.append('id', this.batch_id);  //TODO: do they enter id or does comptuer automate it?
            formData1.append('recipe_id', this.recipe_id);
            formData1.append('tank_id', this.tank_id);
            formData1.append('volume', this.volume);
            formData1.append('generation', this.generation);
            this.$http.post('https://ninkasi-server.herokuapp.com/batches', formData1)
/*
         var formData2 = new FormData();
            formData2.append('batch_id', this.batch_id);
            formData2.append('ph', this.batch_id);
            formData2.append('abv', this.abv);
            formData2.append('pressure', this.pressure);
            formData2.append('temp', this.temp);
            this.$http.post('https://ninkasi-server.herokuapp.com/batch_contents_versions', formData2)

*/
      }
    }

};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#dataEntry
  padding 15px
  grid-area entry
  display flex
  flex-direction column
  align-items center
  +less-than(tablet)
    width 90vw
  margin auto
  min-width 350px
  max-width 500px
  .inline
    input
      width 32%
</style>
