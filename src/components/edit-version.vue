<template lang="html">
  <modal
    name="edit-version-modal"
    v-bind:resizable="true"
    v-bind:adaptive="true"
    v-bind:draggable="true"
    @before-close="this.closedEarly"
  >
    <div v-if="version" id="content">
      <h3>Edit Version</h3>
      <div class="formFields grid">
        <div class="col-3 inputGroup">
          <input v-model="pH" type="number" step="0.01" required />
          <label>pH</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="ABV" type="number" step="0.01" required />
          <label>ABV</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="pressure" type="number" step="0.01" required />
          <label>Pressure</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="SG" type="number" step="0.000001" required />
          <label>Specific Gravity</label>
        </div>
        <div class="col-3 inputGroup">
          <input v-model="temp" type="number" step="0.01" required />
          <label>Temperature</label>
        </div>
        <div class="col-3 time inputGroup">
          <datepicker placeholder="Select Date" v-model="time"></datepicker>
        </div>
      </div>
      <button v-on:click="this.closed">Submit</button>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import moment, { Moment } from 'moment';
import { Version } from '@/types/index';

interface IEditVersion {
  SG: number;
  pH: number;
  ABV: number;
  temp: number;
  pressure: number;
  time?: string | Moment;
}

export default Vue.extend({
  name: 'edit-version',
  components: { Datepicker },
  props: ['version'],
  data() {
    return <IEditVersion>{};
  },
  watch: {
    version(version: Version, oldVersion) {
      if (version === undefined) {
        this.$modal.hide('edit-version-modal');
      } else {
        this.$modal.show('edit-version-modal');

        this.pH = version.ph;
        this.SG = version.sg;
        this.ABV = version.abv;
        this.temp = version.temperature;
        this.pressure = version.pressure;
        this.time = moment(version.measured_on).format('YYYY-MM-DDTHH:mm');
      }
    }
  },
  methods: {
    closedEarly() {
      this.$emit('editted-version', undefined);
    },
    closed() {
      this.version.ph = this.pH;
      this.version.sg = this.SG;
      this.version.abv = this.ABV;
      this.version.temperature = this.temp;
      this.version.pressure = this.pressure;
      this.version.measured_on = moment(this.time).toISOString();

      this.$emit('editted-version', this.version);
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#content
  display: grid;
  justify-items: center;
  text-align: center;
  padding: 5px 25px 20px 20px;

modal
  display: grid;
  justify-items: center;
  text-align: center;
  padding 15px
  flex-direction column
  align-items center
  max-width 500px
  button
    margin-top 40px
    margin-bottom 30px

  .formFields
    .time
      display block
      datepicker
        overflow visible
    text-align center
</style>
