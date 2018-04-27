<template lang="html">
  <div>
    <div class="header" v-if="!mobile">
      <a v-on:click="home">home</a>
      <h2>Batch History</h2>
    </div>
    <div id="content">
      <div>
        <h2>Batch</h2>
        <select v-model="batch_id" v-on:change="batchChoose">
          <option disabled value="">Batch</option>
          <option v-for='batch in batches' v-bind:value='batch.id'>{{ batch.id }}</option>
        </select>
      </div>
      <table>
        <tr>
          <th>Date</th>
          <th>SG</th>
          <th>pH</th>
          <th>ABV</th>
          <th>temp</th>
          <th>pressure</th>
        </tr>
        <tr v-for='history in histories'>
          <td>{{ history.updated_at }}</td>
          <td>{{ history.SG }}</td>
          <td>{{ history.pH }}</td>
          <td>{{ history.ABV }}</td>
          <td>{{ history.temp }}</td>
          <td>{{ history.pressure }}</td>
        </tr>
      </table>
      <button v-if="batch_id" type="button" name="button" v-on:click="download">
        Download
      </button>
    </div>
  </div>
</template>

<script>
import router from "../router/index.js"
import Cookie from "js-cookie"
import moment from "moment"

export default {
  name: 'batch-history',
  data() {
    return {
      mobile: false,
      batch_id: '',
      batches: [],
      histories: [],
    }
  },
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.get('loggedIn')) {
        router.push("/")
    }

    this.$http.get(process.env.API + '/batches/')
      .then(batchesResponse => {
        // get our batches data
        this.batches = batchesResponse.body
        // sort the batches by ID
        this.batches.sort((a, b) => a.id - b.id)
      })
  },
  methods: {
    home: function() {
      if (mobile) {
        router.push("/home-mobile")
      }
      router.push("/")
    },
    batchChoose: function() {
      // when the user chooses a batch, get the info on that batch
      this.$http.get(process.env.API + '/batches/' + this.batch_id + '/batch_contents_versions')
        .then(historyResponse => {
          this.histories = historyResponse.body
          // for every batch history, format the date so its easy to read
          for (let history of this.histories) {
            history.updated_at = moment(history.updated_at).format("YY-MM-DD HH:mm")
          }
        }
      )

      // create our header
      let rows = [["Date", "SG", "pH", "ABV", "temp", "pressure"]]

      // for each history element
      for (let history of this.histories) {
        // add in that history row
        rows.push(
          [
            history.updated_at,
            history.SG,
            history.pH,
            history.ABV,
            history.temp,
            history.pressure
          ]
        )
      }

      // create the header for the csv that we will download
      let csvContent = "data:text/csv;charset=utf-8,"
      // rows.forEach(function(rowArray){
      //    let row = rowArray.join(",")
      //    csvContent += row + "\r\n"
      // });

      // for every row, add a comma to the end and some new line chars
      for (let row of rows) {
        csvContent += row.join(',') + "\r\n"
      }
      // redirect to the download link
      window.location = csvContent
    }
  }
}
</script>

<style lang="stylus" scoped>

#content
  display grid
  justify-items center
  text-align center
  min-height 60vh
  p
    color Teal
    font-weight bold
  table
    tr
      td, th
        padding 10px
        border-left 1px solid black
</style>
