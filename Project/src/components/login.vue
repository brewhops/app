<template>
    <div>
        <div class="header">
            <h2>Ninkasi Brew Hops</h2>
        </div>
        <div class="column-1">
            <div id="login">
                <img src="../assets/logo.png" class="logo-med">
                <h2>Login</h2>
                <input v-model.lazy="username" placeholder="username">
                <p>{{ feedback.username }}</p>
                <input v-model.lazy="password" placeholder="passwword">
                <p>{{ feedback.password }}</p>
                <router-link to="/home"><button>Submit</button></router-link>
                <router-link to="/admin">Go to admin page</router-link>
            </div>
        </div>
      </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      feedback: {
        username: '',
        password: '',
      },
    };
  },
  watch() {
    return {
      username() {
        // shorten our username variable for readability
        const username = this.username;

        // if the field is empty, clear the feedback
        // if the username is less than 3 or greater than 20, error
        // if the username is only numbers and letters
        // else there are illegal characters
        if (username.length === 0) {
          this.feedback.username = ''
        } else if (username.length < 3 || username.length > 20) {
          this.feedback.username = 'username must be between 3 and 20 characters'
        } else if (username.match('^[0-9A-z]+$')) {
          this.feedback.username = ''
        } else {
          this.feedback.username = 'username must only be digits and letters'
        }
      },
      password() {
        // shorten our username variable for readability
        const password = this.password

        // if the field is empty, clear the feedback
        // if the password is less than 6 or greater than 25, error
        // if the password is numbers, letters and some select special characters
        // else there are illegal characters
        if (password.length === 0) {
          this.feedback.password = ''
        } else if (password.length < 6 || password.length > 25) {
          this.feedback.password = 'password must be between 6 and 25 characters'
        } else if (password.match('^[0-9A-z@#$%*^!\-=&]+$')) {
          this.feedback.password = ''
        } else {
          this.feedback.password = 'password must only be digits and letters'
        }
      },
    };
  },
};
</script>

<style lang="stylus" scoped>
#login
  display flex
  flex-direction column
  align-items center
  width 30%
  min-width 300px
  img
    margin 20px
  h2
    padding 0
    margin 10px

</style>
