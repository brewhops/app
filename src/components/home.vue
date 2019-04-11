<template>
  <div>
    <div class="header">
      <a v-on:click="logout">Logout</a>
      <h2>Home</h2>
    </div>
    <navbar v-bind:activeState="[true, false, false, false]" />
    <div id="content">
      <tank-monitoring></tank-monitoring>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import tankMonitoring from './tank-monitoring.vue';
import router from '../router';
import { logout } from '../utils';
import Cookie from 'js-cookie';
import NavbarComponent from './navbar.vue';

export default Vue.extend({
  name: 'home',
  components: {
    tankMonitoring,
    navbar: NavbarComponent
  },
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }
  },
  methods: { logout }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints';

#content {
  display: grid;

  +greater-than(desktop) {
    grid-template-columns: 1fr;
  }

  grid-template-columns: 1fr;
  grid-template-areas: 'info';

  +less-than(tablet) {
    grid-template-columns: 98vw;
    grid-template-areas: 'info';
  }

  justify-items: center;
}
</style>
