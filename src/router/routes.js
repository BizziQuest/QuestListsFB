import Profile from '../components/Profile.vue';
import CreateList from '../components/CreateList.vue';
import Lists from '../views/QuestLists.vue';
import List from '../views/QuestList.vue';

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
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutQuestLists.vue'),
  },
  {
    path: '/about/terms-of-service',
    name: 'Terms of Service',
    component: () => import(/* webpackChunkName: "tos" */ '../views/about/TermsOfService.vue'),
  },
  {
    path: '/about/code-of-conduct',
    name: 'Code of Conduct',
    component: () => import(/* webpackChunkName: "conduct" */ '../views/about/CodeOfConduct.vue'),
  },
  {
    path: '/about/privacy-policy',
    name: 'Privacy Policy',
    component: () => import(/* webpackChunkName: "privacy" */ '../views/about/PrivacyPolicy.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/new',
    name: 'New QuestList',
    component: CreateList,
  },
];

export default routes;
