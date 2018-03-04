<template>
  <div>
    <div class="header" v-if="mobile">
       <router-link to="/home-mobile">Home</router-link>
      <h2>Recipe</h2>
    </div>
  <div id="recipe">
    <h2>Pacific Rain Recipe</h2>
    <table>
      <tr>
        <td>Hop 1</td>
        <td>13.23</td>
      </tr>
      <tr>
        <td>Hop 2</td>
        <td>13.23</td>
      </tr>
      <tr>
        <td>Hop 3</td>
        <td>13.23</td>
      </tr>
      <tr>
        <td>Hop 4</td>
        <td>13.23</td>
      </tr>
      <tr>
        <td>Hop 5</td>
        <td>13.23</td>
      </tr>
      <tr>
        <td>Hop 6</td>
        <td>13.23</td>
      </tr>
      <tr>
        <td>Hop 7</td>
        <td>13.23</td>
      </tr>
    </table>
    <router-link to="/tank-info" v-if="mobile">
      <button type="button" name="button">Back to Tank</button>
    </router-link>
  </div>
</div>
</template>

<script>
export default {
  name: 'recipe',
  data() {
    return {
      mobile: false
    };
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
    }
  }
};
</script>

<style lang="stylus" scoped>
#recipe
  grid-area recipe
  text-align center
  table
    text-align left
    margin auto
  h2, h3, h4
    text-align center

table
  td
    padding 5px
</style>
