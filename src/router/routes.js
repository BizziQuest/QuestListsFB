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
  // {
  //   path: '/about/terms',
  //   name: 'Terms',
  //   component: () => import(/* webpackChunkName: "tos" */ '../views/about/Terms.vue'),
  // },
  // {
  //   path: '/about/conduct',
  //   name: 'Conduct',
  //   component: () => import(/* webpackChunkName: "conduct" */ '../views/about/Conduct.vue'),
  // },
  // {
  //   path: '/about/privacy',
  //   name: 'Privacy',
  //   component: () => import(/* webpackChunkName: "privacy" */ '../views/about/Privacy.vue'),
  // },
  {
    path: '/editinfo',
    name: 'EditInfo',
    component: EditInfo,
  },
];

export default routes;
