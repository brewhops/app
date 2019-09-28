import Cookie from 'js-cookie';
import router from '@/router';

export function getAPIUrl(): string {
  if (process.env.VUE_APP_DEPLOYMENT !== 'production-live'
      && Cookie.get("VUE_APP_API")) {
    return <string>Cookie.get("VUE_APP_API");
  } else {
    return process.env.VUE_APP_API;
  }
}

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
