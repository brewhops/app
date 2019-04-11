// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import resource from 'vue-resource';

Vue.use(resource);

Vue.config.productionTip = false;

const v = new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: App,
  ...App
});
