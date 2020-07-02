import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import { preset as rallyPreset } from 'vue-cli-plugin-vuetify-preset-rally/preset';
import '@mdi/font/css/materialdesignicons.css'; // for the default material design icons
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset';
// import { VuetifyPreset } from 'vuetify/types/services/presets';

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  theme: {
    dark: true,
    options: {
      customProperties: true,
    },
    icons: {
      iconfont: 'mdi',
    },
    themes: {
      light: {
        primary: '#fff176',
        secondary: '#ab47bc',
        accent: '#cabf45',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
});
