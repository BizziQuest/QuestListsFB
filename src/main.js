import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import { auth } from './firebase';

Vue.config.productionTip = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('authenticationChanged', {
      id: user.uid,
      email: user.email,
      displayName: 'New Member',
      avatar: '/img/unknown_user.svg',
    });
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
