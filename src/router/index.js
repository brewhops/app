import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import admin from '@/components/admin';
import home from '@/components/home';
import tankMonitoring from '@/components/tank-monitoring';
import tankInfo from '@/components/tank-info';
import homeMobile from '@/components/home-mobile';
import dataEntry from '@/components/data-entry';
import dataSubmission from '@/components/data-submission';
import recipe from '@/components/recipe';
import history from '@/components/history';

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
      component: dataEntry,
      name: 'data-entry',
      path: '/data-entry'
    },
    {
      component: dataSubmission,
      name: 'data-submission',
      path: '/data-submission'
    },
    {
      component: recipe,
      name: 'recipe',
      path: '/recipe'
    },
    {
      component: history,
      name: 'batch-history',
      path: '/history'
    }
  ]
});
