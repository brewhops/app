<template>
  <div v-if="!employee" class="element">
    <h2>Edit User</h2>
    <select id="edit-user" v-on:change="populateEmployee" v-model="employee">
      <option disabled value="">Select Employee</option>
      <option v-for="emp in employees" v-bind:key="emp.id" :value="emp">{{
        `${emp.first_name} ${emp.last_name}`
      }}</option>
    </select>
  </div>
  <div v-else class="element">
    <h2>Edit {{ name }}</h2>
    <table>
      <tr>
        <td><h4>Name:</h4></td>
        <td>
          <h4>{{ name }}</h4>
        </td>
      </tr>
      <tr>
        <td><h4>Username:</h4></td>
        <td>
          <h4>{{ username }}</h4>
        </td>
      </tr>
    </table>

    <input v-model.lazy="password" placeholder="Password" type="password" />
    <span>{{ feedback.password }}</span>
    <input v-model.lazy="passwordcheck" placeholder="Re-enter password" type="password" />
    <span>{{ feedback.passwordcheck }}</span>
    <div class="checkbox">
      <input type="checkbox" id="checkbox" v-model="admin" />
      <p>User is admin</p>
    </div>
    <div>
      <p>{{ feedback.server.user }}</p>
    </div>
    <button v-on:click="editSubmit">Submit</button>
    <button v-on:click="clearUser">Select a User</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';
import router from '../../router/index.js';
import { Tank, BrewhopsCookie, Employee } from '../../types';

interface IEditUserState {
  employee?: Employee;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  admin: boolean;
  passwordcheck: string;
  feedback: {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    passwordcheck: string;
    server: {
      user: string;
    };
  };
}

// tslint:disable: no-console

export default Vue.extend({
  name: 'edit-user',
  props: ['employees'],
  data(): IEditUserState {
    return {
      employee: undefined,
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      admin: false,
      passwordcheck: '',
      feedback: {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        passwordcheck: '',
        server: {
          user: ''
        }
      }
    };
  },
  computed: {
    name: function() {
      if (this.employee) {
        return `${this.first_name} ${this.last_name}`;
      }
    }
  },
  watch: {
    first_name() {
      // shorten our username variable for readability
      const { first_name } = this;

      if (!first_name.match('^[A-z\-]+$')) {
        this.feedback.first_name = 'First name can only be digits and letters';
      }
    },
    last_name() {
      // shorten our username variable for readability

      const { last_name } = this;

      if (!last_name.match(/^[a-zA-Z\-\s]*$/)) {
        this.feedback.last_name = 'Last name can only be letters, spaces, and hyphens';
      }
    },
    username() {
      const { username } = this;

      // if the username is already in the  database,
      // give feedback and exit the function
      for (const x in this.employees) {
        if (this.employees[x].username === username) {
          this.feedback.username = 'Username taken';

          return;
        }
      }

      if (username.length === 0) {
        this.feedback.username = 'Username required';
      } else if (username.length < 3 || username.length > 20) {
        this.feedback.username = 'Username must be between 3 and 20 characters';
      } else if (username.match('^[0-9A-z]+$')) {
        this.feedback.username = '';
      } else {
        this.feedback.username = 'Username must only be digits and letters';
      }
    },
    password() {
      const { password } = this;

      if (password.length === 0) {
        this.feedback.password = 'Password required';
      } else if (password.length < 6 || password.length > 25) {
        this.feedback.password = 'Password must be between 6 and 25 characters';
      } else if (password.match('^[0-9A-z@#$%*^!\-=&]+$')) {
        this.feedback.password = '';
      } else {
        this.feedback.password = 'Password must only be digits and letters';
      }
    },
    passwordcheck() {
      if (this.password && this.passwordcheck === this.password) {
        this.feedback.passwordcheck = '';
      } else {
        this.feedback.passwordcheck = 'Passwords must match';
      }
    }
  },
  methods: {
    async editSubmit() {
      if (this.employee) {
        const user = {
          first_name: this.first_name,
          last_name: this.last_name,
          username: this.username,
          admin: this.admin,
          phone: '',
          password: CryptoJS.SHA3(this.password).toString()
        };

        const headers = {
          Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
        };

        try {
          const response = await this.$http.patch(
            `${process.env.API}/employees/id/${this.employee.id}`,
            user,
            {
              headers
            }
          );
          if (response.ok) {
            this.$emit('update');
            this.feedback.server.user = 'User succesfully edited.';
            setTimeout(async () => (this.feedback.server.user = ``), 5000);
          }
        } catch (err) {
          console.error(err);
          this.feedback.server.user = 'Failed to edit user.';
        }
      }
    },
    populateEmployee() {
      if (this.employee) {
        const { first_name, last_name, password, admin, username, phone } = this.employee;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.admin = admin;
      }
    },
    clearUser() {
      this.employee = undefined;
    }
  }
});
</script>

<style lang="stylus" scoped>
#edit-user
  width 80%
h4
  text-align left
table
  width 80%
</style>
