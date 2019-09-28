<template>
  <div v-if="this.brands && this.employees && this.tanks">
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
      <create-user :employees="this.employees" @update="this.usersUpdate"></create-user>
      <edit-user :employees="this.employees" @update="this.usersUpdate"></edit-user>
      <create-brand @update="this.brandsUpdate"></create-brand>
      <edit-brand :brands="this.brands" @update="this.brandsUpdate"></edit-brand>
    </div>
  </div>
  <div v-else>
    <loader></loader>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import router from '@/router';
import { TANK_STATUS, getAPIUrl } from '@/utils';
import CreateTank from '@/components/admin/create-tank.vue';
import UpdateTank from '@/components/admin/edit-tank.vue';
import CreateUser from '@/components/admin/create-user.vue';
import EditUser from '@/components/admin/edit-user.vue';
import CreateBrand from '@/components/admin/create-brand.vue';
import EditBrand from '@/components/admin/edit-brand.vue';
import Loader from '@/components/loader.vue';
import { Employee, Tank, Recipe, BrewhopsCookie } from '@/types/index';
// tslint:disable: no-console

interface IAdminState {
  employees: Employee[];
  tanks: Tank[];
  brands: Recipe[];
  tankStatuses: string[];
  debugging: string;
}

export default Vue.extend({
  name: 'admin',
  components: {
    'create-tank': CreateTank,
    'update-tank': UpdateTank,
    'create-user': CreateUser,
    'edit-user': EditUser,
    'create-brand': CreateBrand,
    'edit-brand': EditBrand,
    Loader
  },
  data(): IAdminState {
    return {
      employees: [],
      tanks: [],
      brands: [],
      tankStatuses: [
        TANK_STATUS.BUSY,
        TANK_STATUS.BROKEN,
        TANK_STATUS.AVAILABLE,
        TANK_STATUS.BREWING,
        TANK_STATUS.TRANSFERRING,
        TANK_STATUS.COMPLETED
      ],
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

    try {
      await this.tankUpdate();
      await this.usersUpdate();
      await this.brandsUpdate();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    async tankUpdate() {
      try {
        const response = await this.$http.get(`${getAPIUrl()}/tanks/`);
        this.tanks = response.data as Tank[];
      } catch (err) {
        console.error(err);
      }
    },
    async usersUpdate() {
      try {
        const response = await this.$http.get(`${getAPIUrl()}/employees/`);
        this.employees = response.data as Employee[];
      } catch (err) {
        console.error(err);
      }
    },
    async brandsUpdate() {
      try {
        const response = await this.$http.get(`${getAPIUrl()}/recipes/`);
        this.brands = response.data as Recipe[];
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#content
  display grid
  grid-template-columns 1fr 1fr
  grid-gap 3vw
  width 80%
  margin auto
  align-items flex-start
  overflow-x: hidden;
  align-content center
  +less-than(1400px)
    width 98%
    align-content center
    grid-template-rows auto
    grid-template-columns 1fr
    justify-content center
  +less-than(400px)
    grid-template-rows auto
    grid-template-columns center 80vw


.element
  padding 20px
  text-align center

#brand
  .inline
    input
      width 49%
</style>
