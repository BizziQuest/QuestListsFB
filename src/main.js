import { onAuthStateChanged } from 'firebase/auth';
import { createVue } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

// we can use this if we need, but the reply theme preset uses a different font
// import 'roboto-fontface/css/roboto/roboto-fontface.css';
import { auth } from './firebase';

import i18n from './i18n';

// Vue.config.productionTip = false;

onAuthStateChanged(auth, (user) => {
  if (user) {
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

const app = createVue({
  router,
  store,
  // vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

app.use(vuetify);

if (window.Cypress) window.$app = app;
