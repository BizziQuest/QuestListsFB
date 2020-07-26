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
// const listItemsCollection = db.collection('listItems');
const stateGroupsCollection = db.collection('states');
const usersCollection = db.collection('users');
const userStatesCollection = db.collection('userListItemStates');

async function getListItems(fbList) {
  const listItemsCollection = db.collection(`lists/${fbList.id}/listItems`);
  const listItems = [];
  debugger;
  const items = await listItemsCollection.get();
  items.forEach(async (doc) => {
    const item = doc.data();
    item.id = doc.id;
    listItems.push(item);
  });
  return listItems.sort((a, b) => a.order < b.order);
}

/** Returns all items in a collection as an ordered list.
 * All items must have an `order` field.
*/
async function getOrderedCollectionAsList(collectionPath) {
  debugger;
  const collection = await db.collection(collectionPath).get();
  const list = [];
  const items = await collection.get();
  items.forEach(async (doc) => {
    const item = doc.data();
    item.id = doc.id;
    list.push(item);
  });
  return list.sort((a, b) => a.order < b.order);
}

async function getListStates(fbList) {
  const fbStatesDoc = await fbList.stateGroup.get();
  if (!fbStatesDoc) return [];
  const statesDoc = fbStatesDoc.data();
  return statesDoc.states.sort((state) => state.order);
}

export {
  fbApp,
  fbAnalytics,
  db,
  auth,
  currentUser,
  globalPreferences,
  listsCollection,
  // listItemsCollection,
  stateGroupsCollection,
  usersCollection,
  userStatesCollection,
  getListItems,
  getListStates,
  getOrderedCollectionAsList,
};
