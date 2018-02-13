<template>
<div id="app">
  <router-view/>
</div>
</template>

<script>
export default {
  name: 'App',
};
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

h1, h2, h3, h4, h5, h6
  color Teal
  font-weight bold

h1
  font-size 2em
  padding 20px
h2
  font-size 1.8em
  padding 15px
h3
  font-size 1.4em
  padding 10px
h4
  font-size 1.2em
  padding 5px

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
  font-weight 100
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
    font-weight 100
  h2
    font-size 1.5em
    font-weight 100
    margin 0


//************* inputs *************//
input
  padding 10px
  box-sizing border-box
  font-size 1em
  display block
  margin 10px 0
  width 100%
  color Teal
  font-weight bold
  outline none
  border 1px solid #cccccc
  BackgroundColorTransition(focus, 0.3s, white, darken(white, 5%))

.inline
  display flex
  justify-content space-between

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

</style>
