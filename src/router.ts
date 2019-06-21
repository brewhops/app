import Vue from 'vue';
import Router from 'vue-router';
import login from '@/views/login.vue';
import admin from '@/views/admin.vue';
import home from '@/views/home.vue';
import tankInfo from '@/views/tank-info.vue';
import batchHistory from '@/views/batch-history.vue';
import tankHistory from '@/views/tank-history.vue';
import { KeyAccessor } from '@/types/index';

Vue.use(Router);

const routes = [
  {
    component: login,
    name: 'login',
    path: '/',
    meta: {
      title: 'Brewhops'
    }
  },
  {
    component: admin,
    name: 'admin',
    path: '/admin',
    meta: {
      title: 'Brewhops - Settings'
    }
  },
  {
    component: home,
    name: 'home',
    path: '/home',
    meta: {
      title: 'Brewhops - Home'
    }
  },
  {
    component: tankInfo,
    name: 'tank-info',
    path: '/tank-info/:tankID',
    meta: {
      title: 'Brewhops - Tank Information'
    }
  },
  {
    component: batchHistory,
    name: 'batch-history',
    path: '/batch-history',
    meta: {
      title: 'Brewhops - Batch History'
    }
  },
  {
    component: tankHistory,
    name: 'tank-history',
    path: '/tank-history',
    meta: {
      title: 'Brewhops - Tank History'
    }
  }
]

// tslint:disable-next-line:no-default-export
const router = new Router({
  routes,
  mode: 'history',
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active"
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el: any) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map((tagDef: KeyAccessor) => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach((tag: Node) => document.head.appendChild(tag));

  next();
});


export default router;
