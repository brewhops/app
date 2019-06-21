<template>
  <div>
    <div id="content">
      <tank-monitoring></tank-monitoring>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import tankMonitoring from '@/components/tank-monitoring.vue';
import router from '@/router';
import Cookie from 'js-cookie';

export default Vue.extend({
  name: 'home',
  components: { tankMonitoring },
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.getJSON('loggedIn')) {
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
