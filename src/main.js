import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import firebase from 'firebase/app';
import '@firebase/auth';

require('dotenv').config();

Vue.config.productionTip = false;


const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.authDomain,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: 'questlists',
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    const user = firebase.auth().currentUser;
    store.dispatch('autoSignIn', { email: user.email, id: user.uid });
  } else {
    // No user is signed in.
    console.log('user logged out');
  }
});


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
