<template lang="html">
  <div id="modalHolder">
    <modal name="edit-version-modal" :overflow="'visable'" @before-close="this.closed">
      <div id="content">
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
            <input v-model="temp" type="number" step="0.1" required />
            <label>Temperature</label>
          </div>
          <div class="col-3 time inputGroup">
            <datepicker placeholder="Select Date" v-model="time"></datepicker>
          </div>
        </div>
        <button>Submit</button>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';

export default Vue.extend({
  name: 'edit-version',
  components: { Datepicker },
  props: ['version'],
  watch: {
    version(newVersion, oldVersion) {
      if (newVersion === undefined) {
        this.$modal.hide('edit-version-modal');
      } else {
        this.$modal.show('edit-version-modal');
      }
    }
  },
  methods: {
    closed() {
      this.$emit('editted-version', this.version);
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

.v--modal-overlay .v--modal-box
  overflow visible

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
    margin-top 30px
    margin-bottom 30px

  .formFields
    .time
      display block
    text-align center
</style>
