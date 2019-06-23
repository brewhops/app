import Cookie from 'js-cookie';
import router from '@/router';

export function isLoggedIn(): boolean {
  if (Cookie.getJSON('loggedIn')) {
    return Cookie.getJSON('loggedIn');
  } else {
    return false;
  }
}

export function isAdmin(): boolean {
  if(Cookie.getJSON('loggedIn')) {
    return Cookie.getJSON('loggedIn').admin;
  } else {
    return false
  }
}

export function logout(): void {
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

export enum ACTION {
  PRIMARY_FERMENTATION = 1,
  EXCEPTION = 6
}
