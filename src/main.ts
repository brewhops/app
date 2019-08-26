import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueResource);

process.env.VUE_APP_API = process.env.NODE_ENV === 'production-live' ? process.env.VUE_APP_API_PROD : process.env.VUE_APP_API_STAGING;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
