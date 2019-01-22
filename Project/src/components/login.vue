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
      <input v-model.lazy="password" placeholder="password" type="password">
      <span>{{ feedback.password }}</span>
      <button v-on:click="submit">Submit</button>
      <button v-if="isAdmin" v-on:click="validateAdmin" type="button" name="button">Admin Page</button>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import router from "../router/index.js"
import CryptoJS from "crypto-js"
import Cookie from "js-cookie"

interface IData {
  mobile: any;
  isAdmin: any;
  username: any;
  password: any;
  encryptedPassword: any;
  feedback: any;
  submitLink: any;
}

interface ILogin {
  name: any;
  data: () => IData;
  watch: any;
  beforeMount: any;
  methods: any;
  mobile?: any;
  encryptedPassword?: any;
  feedback?: any;
  submitLink?: any;
  sendToHome?: any;
  $http?: any;
  employees?: any;
}

const login: ILogin = {
  name: 'login',
  data: function() {
    return {
      employees: {},
      mobile: false,
      isAdmin: false,
      username: '',
      password: '',
      encryptedPassword: '',
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

      // if the username is admin
      for (var x in this.employees) {
        if (this.employees[x].username === username) {
          this.encryptedPassword = this.employees[x].password
          if (this.employees[x].admin === true) {
            this.isAdmin = true
          }
        }
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

    // if the cookie has login information in it already
    // then send us straight to the home page
    if (Cookie.get('loggedIn')) {
      this.sendToHome()
    }

    //get users from heroku
    this.$http.get(process.env.API + '/employees').then(response => {
      // get body data
      this.employees = response.body;
    }, response => {
      console.log('Response error, cant access employees page', response);
    });
  },
  methods: {
      submit: function () {
        // for each employee in the database
        for(var x in this.employees) {
          // if the username matches the inputed username
          if(this.employees[x].username === this.username) {
            if (this.validPassword(this.username, this.encryptedPassword, this.password)) {
              this.createCookie(this.username, this.isAdmin);
              // send us over to the home page
              this.sendToHome()
            }
          }
        }
        // we were never redirected, so the login was invalid
        this.feedback.password = 'Invalid Login'
      },
      validateAdmin: function () {
        // saving for reference: to encrypt
        // CryptoJS.AES.encrypt(password, username).toString();

        if (this.validPassword(this.username, this.encryptedPassword, this.password)) {
          this.createCookie(this.username, this.isAdmin);
          router.push("admin")
        }
      },
      // redirect over to the home page
      sendToHome: function() {
        if (this.mobile) {
          router.push("home-mobile")
        } else {
          router.push("home")
        }
      },
      // decrypt the password and check if it is valid
      validPassword: function(username, encryptedPassword, enteredPassword) {
        // decrypt the user password from the database
        var decryptedPassword = CryptoJS.AES.decrypt(
            encryptedPassword,
            username
          ).toString(CryptoJS.enc.Utf8)

        // if the decrypted password at that same point matches the user password
        if(decryptedPassword === enteredPassword) {
          return true
        }
      },
      createCookie: function(username, adminStatus) {
        if (!Cookie.get('loggedIn')) {
          Cookie.set('loggedIn', {
            'username': username,
            'admin': adminStatus,
          })
        }
      }
    }
};

export default login;
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
