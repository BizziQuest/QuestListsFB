import { onAuthStateChanged } from 'firebase/auth';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import {setupI18n} from './i18n';
import vuetify from './plugins/vuetify';

// we can use this if we need, but the reply theme preset uses a different font
// import 'roboto-fontface/css/roboto/roboto-fontface.css';
import { auth } from './firebase';

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

// const i18n = setupI18n();

const app = createApp(App)

app.use(vuetify);
app.use(store);
app.use(router);
// app.use(i18n);

if (window.Cypress) window.$app = app;

app.mount('#app')
