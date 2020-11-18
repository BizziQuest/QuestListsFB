import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
// we can use this if we need, but the reply theme preset uses a different font
// import 'roboto-fontface/css/roboto/roboto-fontface.css';
import { auth } from './firebase';

Vue.config.productionTip = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    // TODO: payload is only from firebase, not firecloud db,
    //   so we should load profile daata from DB.
    store.dispatch('authenticationChanged', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      avatar: user.photoURL,
      emailVerified: user.emailVerified,
      useGravatar: user.useGravatar,
    });
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
