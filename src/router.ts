import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login.vue';
import admin from '@/components/admin/admin.vue';
import home from '@/components/home.vue';
import tankMonitoring from '@/components/tank-monitoring.vue';
import tankInfo from '@/components/tank-info/tank-info.vue';
import batchHistory from '@/components/batch-history.vue';
import tankHistory from '@/components/tank-history.vue';

Vue.use(Router);

// tslint:disable-next-line:no-default-export
export default new Router({
  mode: 'history',
  routes: [
    {
      component: login,
      name: 'login',
      path: '/'
    },
    {
      component: admin,
      name: 'admin',
      path: '/admin'
    },
    {
      component: home,
      name: 'home',
      path: '/home'
    },
    {
      component: tankMonitoring,
      name: 'tank-monitoring',
      path: '/tank-monitoring'
    },
    {
      component: tankInfo,
      name: 'tank-info',
      path: '/tank-info/:tankID'
    },
    {
      component: batchHistory,
      name: 'batch-history',
      path: '/batch-history'
    },
    {
      component: tankHistory,
      name: 'tank-history',
      path: '/tank-history'
    }
  ]
});
