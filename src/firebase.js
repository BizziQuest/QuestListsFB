import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/analytics';

require('dotenv').config();

// firebase init goes here
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_APP_ID,
};

// firebase utils
const fbApp = firebase.initializeApp(firebaseConfig);
const fbAnalytics = firebase.analytics();
const auth = fbApp.auth();
const db = fbApp.firestore();
const { currentUser } = auth;

// firebase settings go here
const settings = {};

db.settings(settings);

// firebase collections
const globalPreferences = db.collection('globalPreferences');
const listsCollection = db.collection('lists');
const listItemsCollection = db.collection('listItems');
const statesCollection = db.collection('states');
const userStatesCollection = db.collection('userListItemStates');

export {
  fbApp,
  fbAnalytics,
  db,
  auth,
  currentUser,
  globalPreferences,
  listsCollection,
  listItemsCollection,
  statesCollection,
  userStatesCollection,
};