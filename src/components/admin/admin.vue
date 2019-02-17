<template>
  <div>
    <div class="header">
      <a v-on:click="logout">Logout</a>
      <h2>Ninkasi Admin</h2>
    </div>
    <navbar v-bind:activeState="[false, false, false, true]" />
    <div id="content">
      <create-tank
        :tanks="this.tanks"
        :statuses="this.tankStatuses"
        @update="this.tankUpdate"
      ></create-tank>
      <update-tank
        :tanks="this.tanks"
        :statuses="this.tankStatuses"
        @update="this.tankUpdate"
      ></update-tank>
      <create-user :employees="this.employees"></create-user>
      <create-brand></create-brand>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import router from '../../router';
import { logout } from '../../utils';
import Navbar from '../navbar.vue';
import CreateTank from './create-tank.vue';
import UpdateTank from './update-tank.vue';
import CreateUser from './create-user.vue';
import CreateBrand from './create-brand.vue';
import { Employee, Tank, BrewhopsCookie } from '../../types';
// tslint:disable: no-console

interface IAdminState {
  employees: Employee[];
  tanks: Tank[];
  tankStatuses: string[];
  debugging: string;
}

export default Vue.extend({
  name: 'admin',
  components: {
    navbar: Navbar,
    'create-tank': CreateTank,
    'update-tank': UpdateTank,
    'create-user': CreateUser,
    'create-brand': CreateBrand
  },
  data(): IAdminState {
    return {
      employees: [],
      tanks: [],
      tankStatuses: ['busy', 'broken', 'available', 'brewing', 'transferring', 'completed'],
      debugging: ''
    };
  },
  async beforeMount() {
    // if the user is not logged, or they are logged in but not an admin
    // send them to the login page
    if (!Cookie.getJSON('loggedIn') || !Cookie.getJSON('loggedIn').admin) {
      // tslint:disable-next-line:no-console
      console.log(Cookie.getJSON('loggedIn'));
      router.push('/');
    }

    // get users from heroku
    try {
      const response = await this.$http.get(`${process.env.API}/employees`);
      this.employees = response.data.map(emp => emp.username);
    } catch (err) {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
    }

    // get tank numebrs
    try {
      const response = await this.$http.get(`${process.env.API}/tanks`);
      this.tanks = response.data as Tank[];
    } catch (err) {
      this.debugging = 'Debugging Flag: Response error, cant access tanks page';
    }
  },
  methods: {
    logout,
    async tankUpdate() {
      try {
        const response = await this.$http.get(`${process.env.API}/tanks`);
        this.tanks = response.data as Tank[];
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../../styles/breakpoints'

#content
  display grid
  grid-template-columns 1fr 1fr
  grid-gap 3vw
  width 80%
  margin auto
  align-items flex-start
  +less-than(tablet)
    width 98%
    grid-template-rows auto
    grid-template-columns auto


.element
  padding 20px
  text-align center

#brand
  .inline
    input
      width 49%
</style>
