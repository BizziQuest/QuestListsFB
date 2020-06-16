import Vue from 'vue';
import '@firebase/auth';
import firebase from 'firebase/app';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';// eslint-disable-line import/no-cycle
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

Vue.config.productionTip = false;

require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: 'questlists',
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
console.debug(process.env, firebaseConfig);
export const FBApp = firebase.initializeApp(firebaseConfig);

export const auth = FBApp.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('autoSignIn', { email: user.email, id: user.uid });
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
