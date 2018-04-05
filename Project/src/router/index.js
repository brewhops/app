import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import admin from '@/components/admin'
import home from '@/components/home'
import tankMonitoring from '@/components/tank-monitoring'
import tankInfo from '@/components/tank-info'
import homeMobile from '@/components/home-mobile'
import dataEntry from '@/components/data-entry'
import dataSubmission from '@/components/data-submission'
import recipe from '@/components/recipe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/tank-monitoring',
      name: 'tank-monitoring',
      component: tankMonitoring
    },
    {
      path: '/tank-info/:tankID',
      name: 'tank-info',
      component: tankInfo
    },
    {
      path: '/home-mobile',
      name: 'home-mobile',
      component: homeMobile
    },
    {
      path: '/data-entry',
      name: 'data-entry',
      component: dataEntry
    },
    {
      path: '/data-submission',
      name: 'data-submission',
      component: dataSubmission
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: recipe
    }
  ]
})
