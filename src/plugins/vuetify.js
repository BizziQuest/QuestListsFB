import Vue from 'vue';
import Vuetify, { VIcon, VBtn } from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'; // for the default material design icons
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { preset as replyPreset } from 'vue-cli-plugin-vuetify-preset-reply/preset';
import { preset as rallyPreset } from 'vue-cli-plugin-vuetify-preset-rally/preset';
// import QuestListsIcon from '@/components/QuestListsLogo.vue';
import '../assets/questlistsicons.css';
// import QuestlistsSVG from '../assets/questlists-stroke-optimized.svg';

/**
 * We are using two different preset themes. Reply and Rally. See the material presets for more.
 * Here are the original theme colors:
 *  light: {
 *    primary: '#FFF176',
 *    secondary: '#AB47BC',
 *    accent: '#CABF45',
 *    error: '#FF5252',
 *    info: '#2196F3',
 *    success: '#4CAF50',
 *    warning: '#FFC107',
 *  },
 */

const preset = replyPreset;
preset.theme.themes = { // this only works because rally is dark and reply is light
  dark: { ...rallyPreset.theme.themes.dark },
  light: { ...replyPreset.theme.themes.light },
};

Vue.use(Vuetify, {
  components: { VIcon, VBtn }, // load components here to use with :is or :tag attributes
});

export const options = {
  preset,
  // icons: {
  //   iconfont: 'mdi',
  //   values: {
  //     questlists: QuestlistsSVG,
  //   },
  // },
  theme: {
    // default: 'dark',
    options: {
      customProperties: true,
    },
    icons: {
      // 'questlists':
      //  'M 150 350 C 200 350 200 300 200 300 A 50 50 0 0 1 300 300 A 50 50 0 0 0 400 300 A 50 50 0 1 0 300 300'
      // https://codepen.io/anthonydugois/pen/mewdyZ?editors=1010
    },
  },
  // icons: {
  //   values: {
  //     questlists: {
  //       component: QuestListsIcon,
  //     },
  //     'questlists-plus': {
  //       component: QuestListsIcon,
  //       props: {
  //         decoration: 'plus',
  //       },
  //     },
  //     'questlists-link': {
  //       component: QuestListsIcon,
  //       props: {
  //         decoration: 'link',
  //       },
  //     },
  //     'questlists-alt': {
  //       component: QuestListsIcon,
  //       props: {
  //         variant: 'alt',
  //       },
  //     },
  //     'questlists-alt2': {
  //       component: QuestListsIcon,
  //       props: {
  //         variant: 'alt2',
  //       },
  //     },
  //     'questlists-alt3': {
  //       component: QuestListsIcon,
  //       props: {
  //         variant: 'alt3',
  //       },
  //     },
  //     'questlists-alt4': {
  //       component: QuestListsIcon,
  //       props: {
  //         variant: 'alt4',
  //       },
  //     },
  //     'questlists-alt5': {
  //       component: QuestListsIcon,
  //       props: {
  //         variant: 'alt5',
  //       },
  //     },
  // },
  // },
};

export default new Vuetify(options);
