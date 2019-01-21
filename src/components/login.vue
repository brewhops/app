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

<script>
import router from "../router/index.js";
// import CryptoJS from "crypto-js";
import Cookie from "js-cookie";

const CryptoJS = require("crypto-js");

export default {
  name: "login",
  data() {
    return {
      mobile: false,
      isAdmin: false,
      username: "",
      password: "",
      feedback: {
        username: "",
        password: ""
      },
      submitLink: ""
    };
  },
  watch: {
    username: function() {
      // shorten our username variable for readability
      let validUsername = false;
      const { username } = this;

      // if the field is empty, clear the feedback
      // if the username is less than 3 or greater than 20, error
      // if the username is only numbers and letters
      // else there are illegal characters
      if (username.length === 0) {
        this.feedback.username = "";
      } else if (username.length < 3 || username.length > 20) {
        this.feedback.username = "username must be between 3 and 20 characters";
      } else if (!username.match("^[0-9A-z]+$")) {
        this.feedback.username = "username must only be digits and letters";
      } else {
        this.$http
          .get(`${process.env.API}/employees/admin/${username}`)
          .then(response => response.json())
          .then(json => {
            console.log(json);
            this.isAdmin = json.body;
          })
          .catch(err => console.log(err));
      }
    },
    password: function() {
      // shorten our username variable for readability
      const { password } = this;

      // if the field is empty, clear the feedback
      // if the password is less than 6 or greater than 25, error
      // if the password is numbers, letters and some select special characters
      // else there are illegal characters
      if (password.length === 0) {
        this.feedback.password = "";
      } else if (password.length < 6 || password.length > 25) {
        this.feedback.password = "password must be between 6 and 25 characters";
      } else if (password.match("^[0-9A-z@#$%*^!-=&]+$")) {
        this.feedback.password = "";
      } else {
        this.feedback.password = "password must only be digits and letters";
      }
    }
  },
  beforeMount() {
    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
      this.submitLink = "/home-mobile";
    } else {
      this.submitLink = "/home";
    }

    // if the cookie has login information in it already
    // then send us straight to the home page
    if (Cookie.get("loggedIn")) {
      this.sendToHome();
    }
  },
  methods: {
    submit: function() {
      const { username, password: pw } = this;

      const password = CryptoJS.SHA3(pw).toString();

      this.$http
        .post(`${process.env.API}/employees/login/`, { username, password })
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.createCookie(this.username, this.isAdmin);
          // send us over to the home page
          this.sendToHome();
        })
        .catch(err => (this.feedback.password = "Invalid Login"));
    },
    // redirect over to the home page
    sendToHome: function() {
      if (this.mobile) {
        router.push("home-mobile");
      } else {
        router.push("home");
      }
    },
    validateAdmin: function() {
      if (this.isAdmin) {
        const { username, password: pw } = this;

        const password = CryptoJS.SHA3(pw).toString();

        this.$http
          .post(`${process.env.API}/employees/login/`, { username, password })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            this.createCookie(this.username, this.isAdmin);
            router.push("admin");
          })
          .catch(err => (this.feedback.password = "Invalid Login"));
      } else {
        this.feedback.username = 'User is not an administrator'
      }
    },
    createCookie: function(username, adminStatus) {
      if (!Cookie.get("loggedIn")) {
        Cookie.set("loggedIn", {
          username: username,
          admin: adminStatus
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
#login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  min-width: 300px;

  img {
    margin: 20px;
  }

  h2 {
    padding: 0;
    margin: 10px;
  }
}
</style>
