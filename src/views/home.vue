<template>
  <div class="content">
    <tank-monitoring></tank-monitoring>
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

<style lang="stylus" scoped></style>
