// import Vue from 'vue';
// import Vuetify, { createVuetify, VIcon, VBtn } from 'vuetify/lib';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css'; // for the default material design icons
import 'material-design-icons-iconfont/dist/material-design-icons.css';
// import { preset as replyPreset } from 'vue-cli-plugin-vuetify-preset-reply/preset';
// import { preset as rallyPreset } from 'vue-cli-plugin-vuetify-preset-rally/preset';
import '../assets/QuestLists-font/questlistsicons.scss';
import 'vuetify/styles'
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

// const preset = replyPreset;
// preset.theme.themes = { // this only works because rally is dark and reply is light
//   dark: { ...rallyPreset.theme.themes.dark },
//   light: { ...replyPreset.theme.themes.light },
// };

// Vue.use(Vuetify, {
//   components: { VIcon, VBtn }, // load components here to use with :is or :tag attributes
// });

export const options = {
  // preset,
  theme: {
    // default: 'dark',
    options: {
      customProperties: true,
    },
  },
  icons: {
    values: {
      questlists: 'ql ql-➰',
      'questlists-27B0': 'ql ql-27B0',
      'questlists-➰': 'ql ql-CurlyLoopEmoji',

      'questlists-002B': 'ql ql-002B',
      'questlists-+': 'ql ql-plus',
      'questlists-plus': 'ql ql-plus',

      'questlists-0030': 'ql ql-0030',
      'questlists-0': 'ql ql-zero',
      'questlists-zero': 'ql ql-zero',

      'questlists-2717': 'ql ql-2717',
      'questlists-✗': 'ql ql-ballotx',

      'questlists-002D': 'ql ql-002D',
      'questlists--': 'ql ql-hyphen',

      'questlists-0078': 'ql ql-0078',
      'questlists-x': 'ql ql-x',

      'questlists-0051': 'ql ql-0051',
      'questlists-Q': 'ql ql-Q',

      'questlists-0070': 'ql ql-0070',
      'questlists-p': 'ql ql-p',

      'questlists-2713': 'ql ql-2713',
      'questlists-✓': 'ql ql-checkmark',

      'questlists-2718': 'ql ql-2718',
      'questlists-✘': 'ql ql-HeavyBallotX',

      'questlists-274C': 'ql ql-274C',
      'questlists-❌': 'ql ql-CrossMarkEmoji',

      'questlists-006E': 'ql ql-006E',
      'questlists-n': 'ql ql-n',

      'questlists-2699': 'ql ql-2699',
      'questlists-⚙': 'ql ql-GearEmoji',

      'questlists-2705': 'ql ql-2705',
      'questlists-✅': 'ql ql-WhiteHeavyCheckMarkEmoji',

      'questlists-2714': 'ql ql-2714',
      'questlists-✔': 'ql ql-HeavyCheckMarkEmoji',

      'questlists-2A37': 'ql ql-2A37',
      'questlists-⨷': 'ql ql-MultiplicationSignInDoubleCircle',

      'questlists-270D': 'ql ql-270D',
      'questlists-✍': 'ql ql-WritingHandEmoji',

      'questlists-270F': 'ql ql-270F',
      'questlists-✏': 'ql ql-PencilEmoji',

      'questlists-2710': 'ql ql-2710',
      'questlists-✐': 'ql ql-UpperRightPencil',

      'questlists-2712': 'ql ql-2712',
      'questlists-✒': 'ql ql-BlackNibEmoji',

      'questlists-25B7': 'ql ql-25B7',
      'questlists-▷': 'ql ql-WhiteRightPointingTriangle',

      'questlists-25B6': 'ql ql-25B6',
      'questlists-▶': 'ql ql-BlackRightPointingTriangle',

      'questlists-25BB': 'ql ql-25BB',
      'questlists-▻': 'ql ql-WhiteRightPointingPointer',

      'questlists-26ED': 'ql ql-26ED',
      'questlists-⛭': 'ql ql-GearWithoutHub',

      'questlists-2605': 'ql ql-2605',
      'questlists-★': 'ql ql-BlackStar',

      'questlists-1F511': 'ql ql-1F511',
      'questlists-🔑': 'ql ql-key',

      'questlists-2193': 'ql ql-2193',
      'questlists-↓': 'ql ql-arrowdown',

      'questlists-2190': 'ql ql-2190',
      'questlists-←': 'ql ql-arrowleft',

      'questlists-2192': 'ql ql-2192',
      'questlists-→': 'ql ql-arrowright',

      'questlists-2191': 'ql ql-2191',
      'questlists-↑': 'ql ql-arrowup',

      'questlists-1F50E': 'ql ql-1F50E',
      'questlists-🔎': 'ql ql-RightMagnifyingGlass',
      'questlists-search': 'ql ql-🔎',

      'questlists-23FF': 'ql ql-23FF',
      'questlists-⏿': 'ql ql-ObserverEye',

      'questlists-2766': 'ql ql-2766',
      'questlists-❦': 'ql ql-FleuronCenter',

      'questlists-26A1': 'ql ql-26A1',
      'questlists-⚡': 'ql ql-HighVoltageSign',

      'questlists-1F4CD': 'ql ql-1F4CD',
      'questlists-📍': 'ql ql-RoundPushpin',

      'questlists-1F512': 'ql ql-1F512',
      'questlists-🔒': 'ql ql-lock',

      'questlists-27F3': 'ql ql-27F3',
      'questlists-⟳': 'ql ql-ClockwiseGappedCircleArrow',

      'questlists-1F557': 'ql ql-1F557',
      'questlists-🕗': 'ql ql-ClockFaceEightOClock',

      'questlists-0021': 'ql ql-0021',
      'questlists-!': 'ql ql-exclam',

      'questlists-1F513': 'ql ql-1F513',
      'questlists-🔓': 'ql ql-OpenLock',

      'questlists-1F393': 'ql ql-1F393',
      'questlists-🎓': 'ql ql-GraduationCap',

      'questlists-1F3A9': 'ql ql-1F3A9',
      'questlists-🎩': 'ql ql-GraduationCapAlt',

      'questlists-1F5D8': 'ql ql-1F5D8',
      'questlists-🗘': 'ql ql-ClockwiseSemicircleArrows',

      'questlists-1F5F2': 'ql ql-1F5F2',
      'questlists-🗲': 'ql ql-lightning',

      'questlists-1F517': 'ql ql-1F517',
      'questlists-🔗': 'ql ql-link',
    },
  },
};

export default createVuetify(options);
