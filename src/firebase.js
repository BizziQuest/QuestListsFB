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

if (process.env.NODE_ENV === 'development') {
  settings.host = process.env.VUE_APP_FIREBASE_DATABASE_URL;
  settings.ssl = false;
}
console.debug('FIREBASE CONFIG: ', firebaseConfig);
db.settings(settings);

// firebase collections
const globalPreferences = db.collection('globalPreferences');
const listsCollection = db.collection('lists');
const listItemsCollection = db.collection('listItems');
const statesCollection = db.collection('states');
const usersCollection = db.collection('users');
const userStatesCollection = db.collection('userListItemStates');

async function getListItems(fbList) {
  const itemsDoc = await fbList.listItems.get();
  if (!itemsDoc) return [];

  const itemsData = itemsDoc.data();
  if (!Object.prototype.hasOwnProperty.call(itemsData, 'items')) return [];

  const items = itemsData.items.map((item) => item); // items doesn't pass the Array.isArray test, so we make it
  return items.sort((a, b) => a.order < b.order);
}

async function getListStates(fbList) {
  const fbStatesDoc = await fbList.states.get();
  if (!fbStatesDoc) return [];
  const statesDoc = fbStatesDoc.data();
  const states = [];
  statesDoc.order.forEach((stateName) => states.push(statesDoc.states[stateName]));
  return states;
}

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
  usersCollection,
  userStatesCollection,
  getListItems,
  getListStates,
};
