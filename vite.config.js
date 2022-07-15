import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
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
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
