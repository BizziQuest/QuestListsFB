import EditInfo from '../components/EditInfo.vue';

import Lists from '../views/Lists.vue';
import List from '../views/List.vue';

const routes = [
  {
    path: '/',
    name: 'Lists',
    component: Lists,
  },
  {
    path: '/Lists/:slug+',
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

export default routes;
