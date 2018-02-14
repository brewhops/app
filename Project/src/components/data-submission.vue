<template>
<div id="dataSubmission">
  <div>
    <h2>New Data Submitted</h2>
    <table>
      <tr>
        <td>Volume</td>
        <td>133.2</td>
      </tr>
      <tr>
        <td>pH</td>
        <td>4.3</td>
      </tr>
    </table>
    <router-link to="/home"> <button type="button" name="button">Edit</button> </router-link>
    <router-link v-bind:to="doneLink"> <button type="button" name="button">OK</button> </router-link>
  </div>
</div>
</template>

<script>
export default {
  name: 'data-submission',
  data() {
    return {
      doneLink: ''
    };
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.doneLink = '/home-mobile'
    } else {
      this.doneLink = '/home'
    }
  }
};
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
