import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { VitePWA } from 'vite-plugin-pwa';
import * as vueConfig from './vue.config.js'
import postcssPresetEnv from 'postcss-preset-env';

const path = require('path');

const pwaOptions = vueConfig.pwa;

export default defineConfig({
  build: {
    cssCodeSplit: false,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vuex',
      // etc.
    ],
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA(pwaOptions)
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
        plugins: [
          postcssPresetEnv,
        ],
    },
  },
});
