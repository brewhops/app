import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import admin from '@/components/admin/admin';
import home from '@/components/home';
import tankMonitoring from '@/components/tank-monitoring';
import tankInfo from '@/components/tank-info/tank-info';
import homeMobile from '@/components/home-mobile';
import batchHistory from '@/components/batch-history';
import tankHistory from '@/components/tank-history';

Vue.use(Router);

// tslint:disable-next-line:no-default-export
export default new Router({
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
      component: homeMobile,
      name: 'home-mobile',
      path: '/home-mobile'
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
