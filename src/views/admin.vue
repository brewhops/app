<template>
  <div v-if="this.brands && this.employees && this.tanks" class="content grid">
    <create-tank
      :tanks="this.tanks"
      :statuses="this.tankStatuses"
      @update="this.tankUpdate"
      class="col-6"
    ></create-tank>
    <update-tank
      :tanks="this.tanks"
      :statuses="this.tankStatuses"
      @update="this.tankUpdate"
      class="col-6"
    ></update-tank>
    <create-user :employees="this.employees" @update="this.usersUpdate" class="col-6"></create-user>
    <edit-user :employees="this.employees" @update="this.usersUpdate" class="col-6"></edit-user>
    <create-brand @update="this.brandsUpdate" class="col-6"></create-brand>
    <edit-brand :brands="this.brands" @update="this.brandsUpdate" class="col-6"></edit-brand>
  </div>
  <div v-else>
    <loader></loader>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import router from '@/router';
import { TANK_STATUS } from '@/utils';
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
        const response = await this.$http.get(`${process.env.VUE_APP_API}/tanks/`);
        this.tanks = response.data as Tank[];
      } catch (err) {
        console.error(err);
      }
    },
    async usersUpdate() {
      try {
        const response = await this.$http.get(`${process.env.VUE_APP_API}/employees/`);
        this.employees = response.data as Employee[];
      } catch (err) {
        console.error(err);
      }
    },
    async brandsUpdate() {
      try {
        const response = await this.$http.get(`${process.env.VUE_APP_API}/recipes/`);
        this.brands = response.data as Recipe[];
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>

<style lang="stylus" scoped>

.content
  max-width 1200px

// each box should get some padding and have everything centered
.element
  padding 20px
  text-align center
  box-sizing border-box
</style>
