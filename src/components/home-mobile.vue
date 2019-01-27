<template lang="html">
  <div>
    <div class="header">
      <a v-on:click="logout">Logout</a>
      <h2>Home</h2>
    </div>
    <div id="content">
      <h2>Menu</h2>
      <router-link to="/tank-monitoring"><button>Tank Monitoring</button></router-link>
      <router-link to="/data-entry"><button>Data Entry</button></router-link>
      <router-link to="/"><button>Schedule</button></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import Cookie from 'js-cookie';

export default Vue.extend({
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
      router.push('/');
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

#content
    display grid
    justify-items center
    text-align center
    align-items center
    p
        color Teal
        font-weight bold
</style>
