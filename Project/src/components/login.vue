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
      <span>{{ feedback.username }}</span>
      <input v-model.lazy="password" placeholder="password">
      <span>{{ feedback.password }}</span>
      <button v-on:click="submit">Submit</button>
      {{ debugging }}
    </div>
  </div>
</div>
</template>

<script>

import router from "../router/index.js"

export
default {
  name: 'login',
  data() {
    return {
      debugging: 'Debugging Flag: No issues to report.',
      database: {},
      mobile: false,
      username: '',
      password: '',
      feedback: {
        username: '',
        password: '',
      },
      submitLink: '',
    };
  },
  watch: {
    username: function() {
      // shorten our username variable for readability
      const username = this.username;

      if (username === 'admin') {
        this.submitLink = '/admin'
      }

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
    password: function() {
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
    }
  },
  beforeMount() {
    if (/iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true
      this.submitLink = '/home-mobile'
    } else {
      this.submitLink = '/home'
    }
    //get users from heroku
    this.$http.get('https://ninkasi-server.herokuapp.com/employees').then(response => {
      // get body data
      this.database = response.body;
    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
      console.log(response);
    });
  },
  methods: {
      submit: function () {
        var flag = false;
        var x;
        for(x in this.database) {
          if(this.database[x].username === this.username) {
            if(this.database[x].password === this.password) {
              router.push("home")
            }
          }
        }
        this.feedback.password = 'Invalid Login'
      }

    }
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
