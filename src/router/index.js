import Vue from 'vue';
import VueRouter from 'vue-router';
import EditInfo from '../components/EditInfo.vue';

import Lists from '../views/Lists.vue';
import List from '../views/List.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Lists',
    component: Lists,
  },
  {
    path: '/Lists/:slug',
    props: true,
    name: 'List',
    component: List,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/editinfo',
    name: 'EditInfo',
    component: EditInfo,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
