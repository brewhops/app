<template>
  <div>
    <div class="header">
      <router-link to="login">Logout</router-link>
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
import router from '../router/index.js';
import Cookie from 'js-cookie';
import NavbarComponent from './navbar.vue';

interface IHomePageState {
  mobile: boolean;
}

export default Vue.extend({
  name: 'home',
  components: {
    tankMonitoring,
    navbar: NavbarComponent
  },
  data(): IHomePageState {
    return {
      mobile: false
    };
  },
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
    }

    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
    }
  },
  methods: {
    logout() {
      if (Cookie.getJSON('loggedIn')) {
        Cookie.remove('loggedIn');
      }
      router.push('/');
    }
  }
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
