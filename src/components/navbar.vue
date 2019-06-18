<template>
  <nav class="navbar">
    <a v-on:click="home" class="option" v-bind:class="{ active: activeState[0] }">Home</a>
    <a v-on:click="batchHistory" class="option" v-bind:class="{ active: activeState[1] }"
      >Batch History</a
    >
    <a v-on:click="tankHistory" class="option" v-bind:class="{ active: activeState[2] }"
      >Tank History</a
    >
    <a
      v-on:click="adminPage"
      v-if="this.admin"
      class="option"
      v-bind:class="{ active: activeState[3] }"
      >Admin</a
    >
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import router from '../router';

interface INavbarState {
  admin: false;
}

export default Vue.extend({
  name: 'navbar',

  data(): INavbarState {
    return {
      admin: false
    };
  },

  props: ['activeState'],

  beforeMount() {
    this.admin = Cookie.getJSON('loggedIn').admin;
  },

  methods: {
    home() {
      if (!Cookie.getJSON('loggedIn')) {
        router.push('/');
      } else {
        router.push('/home');
      }
    },
    batchHistory() {
      if (!Cookie.getJSON('loggedIn')) {
        router.push('/');
      } else {
        router.push('/batch-history');
      }
    },
    tankHistory() {
      if (!Cookie.getJSON('loggedIn')) {
        router.push('/');
      } else {
        router.push('/tank-history');
      }
    },
    adminPage() {
      if (!Cookie.getJSON('loggedIn')) {
        router.push('/');
      } else {
        router.push('/admin');
      }
    }
  }
});
</script>

<style lang="stylus" global>
@import '../styles/breakpoints'

.navbar {
  display flex
  position sticky
  top 0
  background-color #00aaa6
  justify-content center
  z-index 1
}

.option {
  color #ffffff
  text-decoration none
  padding 5px
  margin 5px
  font-size 16pt
  +less-than(tablet){
    font-size 12pt
  }
}

/* onclick color: 267f7d */
.option:hover {
  background-color: #00ccc7;
}
.active {
  background-color: #267f7d;
}
</style>
