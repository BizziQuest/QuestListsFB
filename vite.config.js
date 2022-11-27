import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
const path = require('path');
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
    vuetify({
      autoImport: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
