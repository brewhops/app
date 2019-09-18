<template>
  <div id="app">
    <nav v-if="this.loggedIn" class="navbar">
      <router-link class="option" to="/home">Home</router-link>
      <router-link class="option" to="/batch-history">Batch History</router-link>
      <router-link class="option" to="/tank-history">Tank History</router-link>
      <router-link v-if="this.admin" class="option" to="/admin">Settings</router-link>
      <a class="option" v-on:click="logout">Log Out</a>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { logout, isLoggedIn, isAdmin } from '@/utils';

export default Vue.extend({
  name: 'home',
  data() {
    return {
      admin: isAdmin(),
      loggedIn: isLoggedIn()
    };
  },
  beforeUpdate() {
    this.admin = isAdmin();
    this.loggedIn = isLoggedIn();
  },
  methods: {
    logout
  }
});
</script>

<style lang="stylus">

@import './styles/colors'
@import './styles/mixins'
@import './styles/breakpoints'

//************* globals *************//
html, body
  font-family sans-serif
  font-size 12pt
  min-width 100vw
  min-height 100vh
  padding 0
  margin 0
  background HTMLBackground

h1, h2, h3, h4, h5, h6
  color Teal
  font-weight bold
  margin 0

h1
  font-size 2em
  padding 2vh
h2
  font-size 1.8em
  padding 2vh
h3
  font-size 1.4em
  padding 2vh
h4
  font-size 1.2em
  padding 1vh

a
  cursor pointer

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  color #2c3e50

//************* buttons *************//
button
  background Teal
  color white
  padding 10px 30px
  font-size 1em
  border none
  box-shadow Shadow
  border-radius 15px
  font-weight 400
  min-width 200px
  max-width 300px
  margin 10px
  outline none
  cursor pointer
  transition box-shadow 0.2s
  &:hover
    transition box-shadow 0.2s
    box-shadow none
  &:active
    background darken(Teal, 30%)

//************* header ***********//
.header
  font-family sans-serif
  width 100vw
  background Teal
  text-align center
  box-shadow Shadow
  h2, a
    color white
    padding 0
    line-height 50px
  a
    position absolute
    left 5px
    color white
    text-transform capitalize
    text-decoration none
  h2
    font-size 1.5em
    margin 0


//************* inputs *************//
input, .dropdown
  padding 10px 0
  box-sizing border-box
  font-size 1em
  display block
  width 100%
  color Teal
  font-weight bold
  outline none
  border none
  border-bottom 1px solid #cccccc
  background none
  &:focus
    border-bottom 2px solid Teal

select
  margin 10px 0
  width 100%

.checkbox
  display flex
  align-items center
  justify-content center
  & input, & p
    width auto
    padding 0 10px

.inputGroup
  position relative
  margin 10px 0
  label
    font-size 18px
    font-weight normal
    position absolute
    pointer-events none
    left 0
    bottom 0
    transition 0.2s ease all;
    -moz-transition 0.2s ease all;
    -webkit-transition 0.2s ease all

  input:focus ~ label, input:valid ~ label
    bottom -20px
    color #999
    font-size 14px

.dropdown
  min-height 30px

.inline
  display flex
  justify-content space-around

.logo-med
  height 150px
  width 150px

.column-1, .column-2
  width 100vw
  min-height calc(100vh - 50px)
  align-items center
  justify-content space-around

.column-1
  display flex

.column-2
  display grid
  grid-template-columns 1fr 1fr
  padding 20px
  text-align center


//************** tables *************//
table
  margin auto

//************** grids *************//
.grid
  display grid
  grid-gap 25px 10px
  +greater-than(mobile)
    grid-template-columns repeat(12, 1fr)
    .col-1
      grid-column span 12
    .col-2
      grid-column span 6
    .col-3
      grid-column span 4
    .col-4
      grid-column span 3
    .col-span-8
      grid-column span 8

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
  font-size 14pt
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
