<template lang="html">
  <div>
    <div class="header">
      <router-link to="/">Logout</router-link>
      <h2>Home</h2>
    </div>
    <div id="content">
      <h2>Menu</h2>
      <router-link to="/tank-monitoring"><button>Tank Monitoring</button></router-link>
      <router-link to="/data-entry"><button>Data Entry</button></router-link>
      <router-link to="/"><button>Schedule</button></router-link>
      <h3>Quick Tank Monitoring</h3>
      <router-link to="/tank-info">
        <button>
          <table>
            <tr>
              <td>Tank 238-232</td>
              <td>Urgent</td>
            </tr>
          </table>
        </button>
      </router-link>
      <router-link to="/tank-info">
        <button>
          <table>
            <tr>
              <td>Tank 238-232</td>
              <td>Urgent</td>
            </tr>
          </table>
        </button>
      </router-link>
      <router-link to="/tank-info">
        <button>
          <table>
            <tr>
              <td>Tank 238-232</td>
              <td>Urgent</td>
            </tr>
          </table>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {

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
