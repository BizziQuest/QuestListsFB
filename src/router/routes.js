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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/tos',
    name: 'TOS',
    component: () => import(/* webpackChunkName: "tos" */ '../views/Tos.vue'),
  },
  {
    path: '/conduct',
    name: 'Conduct',
    component: () => import(/* webpackChunkName: "conduct" */ '../views/Conduct.vue'),
  },
  {
    path: '/editinfo',
    name: 'EditInfo',
    component: EditInfo,
  },
];

export default routes;
