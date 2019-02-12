<template>
  <div>
    <div class="header">
      <h2>Ninkasi Brew Hops</h2>
    </div>
    <div class="column-1">
      <div id="login">
        <img src="../assets/logo.png" class="logo-med" />
        <h2>Login</h2>
        <input v-model.lazy="username" v-on:keyup.enter="submit" placeholder="username" />
        <span>{{ feedback.username }}</span>
        <input
          v-model.lazy="password"
          v-on:keyup.enter="submit"
          placeholder="password"
          type="password"
        />
        <span>{{ feedback.password }}</span>
        <button v-on:click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router/index.js';
import CryptoJS from 'crypto-js';
import Cookie from 'js-cookie';

interface ILoginState {
  mobile: boolean;
  isAdmin: boolean;
  username: string;
  password: string;
  feedback: {
    username: string;
    password: string;
  };
  submitLink: string;
}

export default Vue.extend({
  name: 'login',
  data(): ILoginState {
    return {
      mobile: false,
      isAdmin: false,
      username: '',
      password: '',
      feedback: {
        username: '',
        password: ''
      },
      submitLink: ''
    };
  },
  watch: {
    async username(): Promise<void> {
      // shorten our username variable for readability
      const validUsername = false;
      const { username } = this;

      // if the field is empty, clear the feedback
      // if the username is less than 3 or greater than 20, error
      // if the username is only numbers and letters
      // else there are illegal characters
      if (username.length === 0) {
        this.feedback.username = '';
      } else if (username.length < 3 || username.length > 20) {
        this.feedback.username = 'username must be between 3 and 20 characters';
      } else if (!username.match('^[0-9A-z]+$')) {
        this.feedback.username = 'username must only be digits and letters';
      } else {
        try {
          const response = await this.$http.get(`${process.env.API}/employees/admin/${username}`);
          this.isAdmin = response.data;
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.error(err);
        }
      }
    },
    password(): void {
      // shorten our username variable for readability
      const { password } = this;

      // if the field is empty, clear the feedback
      // if the password is less than 6 or greater than 25, error
      // if the password is numbers, letters and some select special characters
      // else there are illegal characters
      if (password.length === 0) {
        this.feedback.password = '';
      } else if (password.length < 6 || password.length > 25) {
        this.feedback.password = 'password must be between 6 and 25 characters';
      } else if (password.match('^[0-9A-z@#$%*^!-=&]+$')) {
        this.feedback.password = '';
      } else {
        this.feedback.password = 'password must only be digits and letters';
      }
    }
  },
  beforeMount(): void {
    if (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
      this.submitLink = '/home-mobile';
    } else {
      this.submitLink = '/home';
    }

    // if the cookie has login information in it already
    // then send us straight to the home page
    if (Cookie.getJSON('loggedIn')) {
      this.sendToHome();
    }
  },
  methods: {
    async submit(): Promise<void> {
      const { username, password: pw } = this;

      const password = CryptoJS.SHA3(pw).toString();

      try {
        const response = await this.$http.post(`${process.env.API}/employees/login/`, {
          username,
          password
        });
        const { id, token } = response.data;
        this.createCookie(id, this.username, this.isAdmin, token);
        this.sendToHome();
      } catch (err) {
        this.feedback.password = 'Invalid Login';
      }
    },
    // redirect over to the home page
    sendToHome(): void {
      if (this.mobile) {
        router.push('home-mobile');
      } else {
        router.push('home');
      }
    },
    createCookie(id, username, admin, token): void {
      if (!Cookie.getJSON('loggedIn')) {
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        Cookie.set('loggedIn', {
          id,
          username,
          admin,
          token
        });
      }
    }
  }
});
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
