import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';// eslint-disable-line import/no-cycle
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import { auth } from './firebase';

Vue.config.productionTip = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('authenticationChanged', {
      id: user.uid,
      email: user.email,
      displayName: 'New Memeber',
      avatar: '/img/unknown_user.svg',
    });
  } else {
    console.debug('user logged out');
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
