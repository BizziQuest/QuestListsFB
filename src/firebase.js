import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import slugify from 'slugify';

require('dotenv').config();

// firebase init goes here
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  measurementId: process.env.VUE_APP_FIREBASE_APP_ID,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
};

// firebase utils
const fbApp = firebase.initializeApp(firebaseConfig);
const nodeEnv = process.env.NODE_ENV;
const fbAnalytics = !(nodeEnv === 'test' || nodeEnv === 'development') ? firebase.analytics() : null;
const auth = fbApp.auth();
if (process.env.VUE_APP_FIREBASE_AUTH_HOST) auth.useEmulator(process.env.VUE_APP_FIREBASE_AUTH_HOST);
const db = fbApp.firestore();
const { currentUser } = auth;

// firebase settings go here
const settings = {};

if (process.env.NODE_ENV === 'development') {
  settings.host = process.env.VUE_APP_FIREBASE_DATABASE_URL;
  settings.ssl = false;
}
db.settings(settings);

const globalPreferences = db.collection('globalPreferences');
const listsCollection = db.collection('lists');
const stateGroupsCollection = db.collection('stateGroups');
const usersCollection = db.collection('users');
const userStatesCollection = db.collection('userListItemStates');

const googleOAuthLogin = new firebase.auth.GoogleAuthProvider();
const facebookOAuthLogin = new firebase.auth.FacebookAuthProvider();

async function getListItems(fbList) {
  const listItemsCollection = db.collection(`lists/${fbList.id}/listItems`);
  let listItems = [];
  const items = await listItemsCollection.get();
  items.forEach(async (doc) => {
    const item = doc.data();
    item.id = doc.id;
    if (Object.hasOwnProperty.call(item, 'data')) {
      listItems = listItems.concat(item.data);
    }
  });
  return listItems.sort((a, b) => a.order < b.order);
}
async function saveListItems(fbListId, listItems) {
  const listItemsCollection = db.collection(`lists/${fbListId}/listItems`);
  const listItemDocs = await listItemsCollection.limit(1).get();
  // TODO: see if size is over 900Kb and create as many docs as neccessary
  if (listItemDocs.empty) {
    await listItemsCollection.add({ data: listItems });
  } else {
    let docID = null;
    listItemDocs.forEach(async (doc) => { docID = doc.id; });
    await listItemsCollection.doc(docID).set({ data: listItems });
  }
}

/** Returns all items in a collection as an ordered list.
 * All items must have an `order` field.
*/
async function getOrderedCollectionAsList(collectionPath) {
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

async function ensureSlugUniqueness(title) {
  const allListsWithTitle = listsCollection.where('title', '==', title);
  const lists = await allListsWithTitle.get();
  if (lists.size < 2) return slugify(title);
  const newSlug = slugify(`${title}-${lists.size}`);
  return newSlug;
}

async function saveUserPreferences(prefs) {
  const userDocument = db.collection('users').doc(auth.currentUser.uid);
  await userDocument.set(prefs, { merge: true });
  return userDocument.get();
}

async function getUserPreferences() {
  const userDocumentRef = db.collection('users').doc(auth.currentUser.uid);
  const userDocument = await userDocumentRef.get();
  if (userDocument.exists) return userDocument.data();
  console.warn('User Prefs don\'t exist: ', auth.currentUser.uid, userDocument.path);
  return {};
}

async function createList(payload) {
  const defaultPayload = {
    title: 'New List',
    color: '#333333',
    description: 'Newly Created List',
    createdAt: Date.now(),
    createdBy: auth.currentUser.uid,
  };
  const newPayload = { ...defaultPayload, ...payload };
  newPayload.slug = await ensureSlugUniqueness(payload.title || 'New List');
  const subList = await listsCollection.add(newPayload);
  return subList;
}

export {
  fbApp,
  fbAnalytics,
  db,
  auth,
  currentUser,
  globalPreferences,
  listsCollection,
  stateGroupsCollection,
  usersCollection,
  userStatesCollection,
  getListItems,
  getListStates,
  getOrderedCollectionAsList,
  saveListItems,
  googleOAuthLogin,
  facebookOAuthLogin,
  ensureSlugUniqueness,
  saveUserPreferences,
  getUserPreferences,
  createList,
};
