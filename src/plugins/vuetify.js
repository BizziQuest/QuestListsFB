import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset';
import '@mdi/font/css/materialdesignicons.css'; // for the default material design icons
import 'material-design-icons-iconfont/dist/material-design-icons.css'; // for material icons. Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  theme: {
    options: {
      customProperties: true,
    },
    icons: {
      // iconfont: 'mdi', // default - only for display purposes
      iconfont: 'md', // default - only for display purposes
    },
    // themes: {
    //   light: {
    //     primary: '#ee44aa',
    //     secondary: '#424242',
    //     accent: '#82B1FF',
    //     error: '#FF5252',
    //     info: '#2196F3',
    //     success: '#4CAF50',
    //     warning: '#FFC107',
    //   },
    // },
  },
});
