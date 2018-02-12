import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import admin from '@/components/admin'
import home from '@/components/home'
import data from '@/components/data'
import tankInfo from '@/components/tank-info'
import homeMobile from '@/components/home-mobile'
import dataEntry from '@/components/data-entry'

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
      path: '/data',
      name: 'data',
      component: data
    },
    {
      path: '/tank-info',
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
    }
  ]
})
