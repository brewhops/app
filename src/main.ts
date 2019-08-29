import Vue from 'vue';
import VueResource from 'vue-resource';
import Cookie from 'js-cookie';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueResource);

Vue.http.interceptors.push((request: any) => {
  const loggedIn = Cookie.getJSON('loggedIn');
  if (loggedIn && !request.headers.get('Authorization')) {
    request.headers.set('Authorization', `Bearer ${loggedIn.token}`);
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
