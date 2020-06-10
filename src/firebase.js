// import firebase from 'firebase/app';
// import store from './store';  // disable-eslint import/no-cycle

// require('dotenv').config();

// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_API_KEY,
//   authDomain: process.env.authDomain,
//   databaseURL: process.env.VUE_APP_DATABASE_URL,
//   projectId: 'questlists',
//   storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
// };

// export const FBApp = firebase.initializeApp(firebaseConfig);

// export const auth = FBApp.auth();

// auth.onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in.
//     // user = firebase.auth().currentUser;
//     store.dispatch('autoSignIn', { email: user.email, id: user.uid });
//   } else {
//     // No user is signed in.
//     console.log('user logged out');
//   }
// });
