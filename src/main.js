import Vue from 'vue';
import '@firebase/auth';
import firebase from 'firebase/app';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';// eslint-disable-line import/no-cycle
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.authDomain,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: 'questlists',
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

export const FBApp = firebase.initializeApp(firebaseConfig);

export const auth = FBApp.auth();

auth.onAuthStateChanged((user) => {
  console.log('onAuthStateChngesd', user);
  if (user) {
    store.dispatch('authenticationChanged', {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      avatar: user.photoURL,
    });
  } else {
    console.log('user logged out');
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
