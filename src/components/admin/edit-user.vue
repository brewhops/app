<template>
  <div v-if="!employee" class="element">
    <h2>Edit User</h2>
    <select class="dropdown" v-on:change="populateEmployee" v-model="employee_id">
      <option disabled value="">Select Employee</option>
      <option v-for="(emp, idx) in employees" v-bind:key="idx" :value="emp.id">{{
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
import router from '@/router';
import { Tank, BrewhopsCookie, Employee } from '@/types/index';

interface IEditUserState {
  employee?: Employee;
  employee_id: string;
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

export default Vue.extend({
  name: 'edit-user',
  props: ['employees'],
  data(): IEditUserState {
    return {
      employee: undefined,
      employee_id: '',
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
    name(): string | undefined {
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
            `${process.env.VUE_APP_API}/employees/id/${this.employee.id}/`,
            user,
            {
              headers
            }
          );
          if (response.ok) {
            this.$emit('update');
            this.feedback.server.user = 'User succesfully edited.';
            setTimeout(async () => {
              this.feedback.server.user = ``;
              this.clearUser();
            }, 5000);
          }
        } catch (err) {
          console.error(err);
          this.feedback.server.user = 'Failed to edit user.';
        }
      }
    },
    populateEmployee() {
      if (this.employee_id) {
        this.employee = this.employees.filter(
          (emp: Employee) => emp.id === parseInt(this.employee_id, 10)
        )[0];
        if (this.employee) {
          const { first_name, last_name, password, admin, username, phone } = this.employee;
          this.first_name = first_name;
          this.last_name = last_name;
          this.username = username;
          this.admin = admin;
        }
      }
    },
    clearUser() {
      this.employee = undefined;
      this.employee_id = '';
    }
  }
});
</script>

<style lang="stylus" scoped>
h4
  text-align left
table
  width 80%
</style>
