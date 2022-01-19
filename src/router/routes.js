import EditInfo from '../components/EditInfo.vue';
import CreateAList from '../components/CreateAList.vue';
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
    props: true,
  },
  {
    path: '/about',
    name: 'About Questlists',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/about/terms-of-service',
    name: 'Terms of Service',
    component: () => import(/* webpackChunkName: "tos" */ '../views/about/Terms.vue'),
  },
  {
    path: '/about/code-of-conduct',
    name: 'Code of Conduct',
    component: () => import(/* webpackChunkName: "conduct" */ '../views/about/Conduct.vue'),
  },
  {
    path: '/about/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "privacy" */ '../views/about/Privacy.vue'),
  },
  {
    path: '/editinfo',
    name: 'EditInfo',
    component: EditInfo,
  },
  {
    path: '/new',
    name: 'New QuestList',
    component: CreateAList,
  },
];

export default routes;
