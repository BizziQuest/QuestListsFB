import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'; // for the default material design icons
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { preset as replyPreset } from 'vue-cli-plugin-vuetify-preset-reply/preset';
import { preset as rallyPreset } from 'vue-cli-plugin-vuetify-preset-rally/preset';

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

Vue.use(Vuetify);
export default new Vuetify({
  preset,
  theme: {
    // default: 'dark',
    options: {
      customProperties: true,
    },
  },
});
