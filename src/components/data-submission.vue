<template>
  <div>
    <div class="header">
      <router-link v-bind:to="doneLink">Home</router-link>
      <h2>Data Submitted</h2>
    </div>
    <div id="dataSubmission">
      <div>
        <h2>Data Submitted</h2>
        <table>
          <tr v-for="(value, key) in lastSubmission" v-bind:key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </table>

        <router-link v-bind:to="doneLink">
          <button type="button" name="button">OK</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';

// tslint:disable: no-any
interface IDataSubmissionState {
  doneLink: string;
  lastSubmission: any;
}
export default Vue.extend({
  name: 'data-submission',
  data(): IDataSubmissionState {
    return {
      doneLink: '',
      lastSubmission: {}
    };
  },
  beforeMount() {
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.doneLink = '/home-mobile';
    } else {
      this.doneLink = '/home';
    }
  },
  mounted() {
    this.lastSubmission = this.$route.params.data;
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/colors'
@import '../styles/mixins'

html
  display flex

#dataSubmission
  Flex(center, center)
  margin auto
  text-align center
  max-width 400px
  height 100vh
  table
    margin 3vh auto
    font-size 1.3em
    td
      padding 5px
      color Teal
</style>
