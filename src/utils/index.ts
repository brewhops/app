import Cookie from 'js-cookie';
import router from '../router';

export function logout() {
  if (Cookie.getJSON('loggedIn')) {
    Cookie.remove('loggedIn');
  }
  router.push('/');
}
