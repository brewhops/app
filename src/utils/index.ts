import Cookie from 'js-cookie';
import router from '../router';

export function logout() {
  if (Cookie.getJSON('loggedIn')) {
    Cookie.remove('loggedIn');
  }
  router.push('/');
}

export enum TANK_STATUS {
  BUSY = 'busy',
  BROKEN = 'broken',
  AVAILABLE = 'available',
  BREWING = 'brewing',
  TRANSFERRING = 'transferring',
  COMPLETED = 'completed'
}