import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'; // for the default material design icons
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { preset } from 'vue-cli-plugin-vuetify-preset-reply/preset';

Vue.use(Vuetify);
export default new Vuetify({
  preset,
  theme: {
    // default: 'light',
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#FFF176',
        secondary: '#AB47BC',
        accent: '#CABF45',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
});
