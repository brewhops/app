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

<script>
import router from "../router/index.js"
import Cookie from "js-cookie"

export default {
  beforeMount() {
    // if the user is not logged in send them to the login page
    if (!Cookie.get('loggedIn')) {
        router.push("/")
    }
  },
  methods: {
    logout: function() {
      if (Cookie.get('loggedIn')) {
        Cookie.remove('loggedIn')
      }
      router.push("/")
    }
  }
}
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
