<template>
<div>
  <div class="header" v-if="mobile">
     <router-link to="/home-mobile">Home</router-link>
    <h2>Data Entry</h2>
  </div>
  <div id="dataEntry">
    <h2 v-if="!mobile">Data Entry</h2>
    <div id="formFields">
      <select v-model='tank_id' v-on:change="tankChoose" ><option v-for='tank in tanks' v-bind:value='tank_id'> Tank {{ tank.id }}</option></select>
      <!-- <input v-model="tank_id" placeholder="Tank Number"> -->
      <select v-model='status'placeholder="Tank Status"><option v-for='option in options' v-bind:value='status'> {{ option }}</option></select>

      <input v-model="specificGravity" placeholder="Specific Gravity">
      <div class="inline">
        <input v-model="ph" placeholder="pH">
        <input v-model="abv" placeholder="ABV">
        <input v-model="temp" placeholder="Temperature">
      </div>
      <input v-model="volume" placeholder="Volume">
      <input v-model="generation" placeholder="Generation">
      <input type="datetime-local" placeholder="Time Measured">
      <!-- <select v-model='tank_id'placeholder="Tank Number"><option v-for='tank in tanks' v-bind:value='tank_id'> Tank {{ tank.id }}</option></select> -->
      <input v-model="recipe_id" placeholder="Brand ID">
      <input v-model="batch_id" placeholder="Batch Number">
      <input v-model="action" placeholder="Action Needed">
    </div>
    Select a tank and here is where the most recent batch info variables are shown:
    <br>
    {{ placeholders }}
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
      batch_id: '',
      action: '',
      mobile: false,
      obj: {},
      tanks: [],
      options: [
         "OK", "CRASH", "DRYHOP"
      ],
      placeholders: {
        specificGravity: 'Specific Gravity',
        tank_id: 'Tank ID',
        status: 'Status',
        ph: 'pH',
        abv: 'ABV',
        temp: 'Temperature',
        volume: 'Volume',
        //bright: '',   //TODO: DO we need bright on this page?? Yes I think, ask connor for formatting
        generation: 'Generation',
        recipe_id: 'Recipe ID',
        batch_id: 'Batch ID',
        action: '',
      }
    };
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }

    this.$http.get('https://ninkasi-server.herokuapp.com/tanks').then(response => {
      // get available tanks
      var x;
      for(x in response.body){
        if(response.body[x].status != "broken" && response.body[x].status != "transferring" && response.body[x].status != "completed"){
          this.tanks.push(response.body[x])
        }
      }

    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
      console.log(response);
    });
  },
  methods: {
      tankChoose: function (){
                //create url to get tank:
      var tankUrl = 'https://ninkasi-server.herokuapp.com/tanks/' + this.tank_id;
        this.$http.get(tankUrl)
          .then(tanksResponse => {
          this.placeholders.tank_id = tanksResponse.body.id; //get tank id
          /********** query batches ********************/
          this.$http.get('https://ninkasi-server.herokuapp.com/batches')
            .then(batchResponse => {
          //  this.batchesData = batchResponse.body
            /********** query batch_contents_versions ********************/
            this.$http.get('https://ninkasi-server.herokuapp.com/batch_contents_versions')
              .then(batchContentsResponse => {
                //Get batches information
               for(var x in (batchResponse.body)){
                if((batchResponse.body)[x].tank_id === this.tank_id){
                  this.placeholders.batch_id = (batchResponse.body)[x].id
                  //this.placeholders.bright = (batchResponse.body)[x].bright
                  this.placeholders.generation = (batchResponse.body)[x].generation
                  this.placeholders.volume = (batchResponse.body)[x].volume
                  this.placeholders.recipe_id = (batchResponse.body)[x].recipe_id

                }
              }
              //Find most recent batch in batch contents and pull that info
              var max = 0
              for(var y in batchContentsResponse.body){
                if((batchContentsResponse.body)[y].batch_id === this.batch_id && (batchContentsResponse.body)[y].version_number > max)
                  max = (batchContentsResponse.body)[y].version_number
                  this.placeholders.aBV = (batchContentsResponse.body)[y].ABV
                  this.placeholders.pH = (batchContentsResponse.body)[y].ph
                  this.placeholders.temp = (batchContentsResponse.body)[y].temp
                  this.placeholders.specificGravity = (batchContentsResponse.body)[y].SG
                }
              }, batchContentsResponse => {
                this.debugging = 'Debugging Flag: Response error, cant access batches contents page';
              });
            /*****************************************/
          }, batchResponse => {
            this.debugging = 'Debugging Flag: Response error, cant access batches page';
          });
        /*****************************************/
        }, tanksResponse => {
          this.debugging = 'Debugging Flag: Response error, cant access tanks page';
        });
      },
      submit: function () {

          var formData1 = new FormData()
          var id
            //formData1.append('id', this.batch_id);  //TODO: do they enter id or does comptuer automate it?
            function submitBatchData(formData1, callback){
              formData1.append('recipe_id', this.recipe_id)
              formData1.append('tank_id', this.tank_id)
              formData1.append('volume', this.volume)
              formData1.append('generation', this.generation)

              callback(formData1)
            }
            this.$http.post('https://ninkasi-server.herokuapp.com/batches', formData1).then(response => {
              id = response.body.id;
              var formData2 = new FormData();
                 function submitBatchContentsData(formData2, callback){
                   formData2.append('batch_id', id)
                   formData2.append('ph', this.ph)
                   formData2.append('abv', this.abv)
                   formData2.append('pressure', this.pressure)
                   formData2.append('temp', this.temp)

                   callback(formData2)
                 }
                 this.$http.post('https://ninkasi-server.herokuapp.com/batch_contents_versions', formData2).then(response2 => {
                   console.log(response2);
                 }, response2 => {
                   this.debugging = 'Debugging Flag: Response error, cant access employees page';
                   console.log(response2);
                 });

            }, response => {
              this.debugging = 'Debugging Flag: Response error, cant access employees page';
              console.log(response);
            });


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
