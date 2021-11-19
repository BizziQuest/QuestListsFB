import {
  getAuth, connectAuthEmulator, GoogleAuthProvider, FacebookAuthProvider,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, connectFirestoreEmulator, collection,
  addDoc, getDocs, getDoc, query, where, limit, setDoc, doc, onSnapshot,
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import slugify from 'slugify';

require('dotenv').config();

// firebase init goes here
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  // measurementId: process.env.VUE_APP_FIREBASE_APP_ID,
  // messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
};

if (process.env.NODE_ENV !== 'development') {
  firebaseConfig.measurementId = process.env.VUE_APP_FIREBASE_APP_ID;
  firebaseConfig.messagingSenderId = process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID;
  firebaseConfig.storageBucket = process.env.VUE_APP_FIREBASE_STORAGE_BUCKET;
}
// firebase utils
const fbApp = initializeApp(firebaseConfig);
const nodeEnv = process.env.NODE_ENV;
const fbAnalytics = !(nodeEnv === 'test' || nodeEnv === 'development') ? getAnalytics() : null;
const auth = getAuth(fbApp);
if (process.env.VUE_APP_FIREBASE_AUTH_HOST) {
  connectAuthEmulator(auth, process.env.VUE_APP_FIREBASE_AUTH_HOST, { disableWarnings: true });
}
const db = getFirestore();
const { currentUser } = auth;

// // firebase settings go here
// const settings = { };

if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, process.env.VUE_APP_FIREBASE_AUTH_HOST);
  connectFirestoreEmulator(db, process.env.VUE_APP_FIREBASE_DATABASE_HOST, process.env.VUE_APP_FIREBASE_DATABASE_PORT);
  //   db.settings({
  //   host: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  //   ssl: false,
  //   merge: true,
  // });
}

const globalPreferences = collection(db, 'globalPreferences');

const listsCollection = collection(db, 'lists');
const stateGroupsCollection = collection(db, 'stateGroups');
const usersCollection = collection(db, 'users');
const userStatesCollection = collection(db, 'userListItemStates');

const googleOAuthLogin = new GoogleAuthProvider();
const facebookOAuthLogin = new FacebookAuthProvider();

async function computeSubListPath(subListRef, routePath) {
  if (!subListRef) return false;
  const subList = await getDoc(subListRef);
  const { slug } = subList.data();
  return `${routePath}/${slug}`;
}

async function getUserDocumentRef() {
  const userDocument = doc(db, 'users', auth.currentUser.uid);
  if (!userDocument.exists) await setDoc(userDocument, {}, { merge: true });
  return userDocument;
}

async function updateUserItemStates(listId, items) {
  const userDocument = await getUserDocumentRef();
  const itemStates = items.reduce((states, item, itemIdx) => {
    const state = { ...item.state };
    if (!state.value) return states;
    return { ...states, [itemIdx]: { value: state.value, title: item.title } };
  }, {});
  const userStatesRef = doc(userDocument, 'states', listId);
  await setDoc(userStatesRef, itemStates);
  return getDoc(userStatesRef);
}

async function getListBySlug(slug) {
  const docQuery = query(listsCollection, where('slug', '==', slug));
  return getDocs(docQuery);
}

async function getListItems(fbList) {
  const listItemsCollection = collection(db, `lists/${fbList.id}/listItems`);
  const currentUserStatesCollection = collection(db, `users/${auth.currentUser?.uid}/states`);
  let userStates = [];
  if (currentUserStatesCollection.exists) {
    const currentUserStatesDoc = await currentUserStatesCollection.doc(fbList.id).get();
    userStates = currentUserStatesDoc.data();
  }
  let listItems = [];
  // to accommodate longer lists, we use multiple documents in a
  // listItem collection
  const listItemsPartials = await getDocs(listItemsCollection);
  listItemsPartials.forEach((listItemsPartialObj) => {
    const listItemsPartial = listItemsPartialObj.data();
    listItems = listItems.concat(listItemsPartial?.data || []);
  });
  listItems.forEach((listItem, listItemIndex) => {
    Object.entries(userStates).find(([userStateIndex, userState]) => {
      if (listItem.title === userState.title) {
        listItems[listItemIndex].state = { ...userState };
        delete userStates[userStateIndex];
        return true;
      }
      return false;
    });
  });
  return listItems.sort((a, b) => a.order < b.order);
}

async function saveListItems(fbListId, listItems) {
  const listItemsCollection = collection(db, `lists/${fbListId}/listItems`);
  const listItemDocsQuery = query(listItemsCollection, limit(1));
  const listItemDocs = await getDocs(listItemDocsQuery);
  // TODO: see if size is over 900Kb and create as many docs as neccessary
  if (listItemDocs.empty) {
    await addDoc(listItemsCollection, { data: listItems });
  } else {
    let docID = null;
    listItemDocs.forEach(async (document) => { docID = document.id; });
    const sanitizedItems = [];
    listItems.forEach((listItem) => {
      const sanitizedListItem = { ...listItem };
      const listItemProps = Object.keys(listItem);
      if (listItemProps.includes('isNewItem')) {
        delete sanitizedListItem.isNewItem;
      }
      if (listItemProps.includes('subList') && !sanitizedListItem.subList) {
        delete sanitizedListItem.subList;
      }
      sanitizedItems.push(sanitizedListItem);
    });
    const docRef = doc(listItemsCollection, docID);
    setDoc(docRef, { data: sanitizedItems });
  }
}

/** Returns all items in a collection as an ordered list.
 * All items must have an `order` field.
*/
async function getOrderedCollectionAsList(collectionPath) {
  const clxn = await collection(db, collectionPath).get();
  const list = [];
  const items = await clxn.get();
  items.forEach(async (document) => {
    const item = document.data();
    item.id = document.id;
    list.push(item);
  });
  return list.sort((a, b) => a.order < b.order);
}

async function getListStates(fbList) {
  const fbStatesDoc = await getDoc(fbList.stateGroup);
  if (!fbStatesDoc) return [];
  const statesDoc = fbStatesDoc.data();
  return statesDoc.states.sort((state) => state.order);
}

async function ensureSlugUniqueness(title) {
  // TODO: sort DESC by created date
  const allListsWithTitle = query(listsCollection, where('title', '==', title));
  let lists = await getDocs(allListsWithTitle);
  if (lists.size < 2) return slugify(title);
  lists = lists.sort((a, b) => a.created_at < b.created_at);
  const lastList = lists[lists.length - 1];
  const titleArray = lastList.title.split('-');
  if (titleArray.length < 2) return slugify(`${title}-1`);
  const count = titleArray[titleArray.length - 1];
  const newIndex = (parseInt(count, 10) || 0) + 1;
  const newSlug = slugify(`${title}-${newIndex}`);
  return newSlug;
}

async function saveUserPreferences(prefs) {
  const userDocument = doc(db, 'users', auth.currentUser.uid);
  await setDoc(userDocument, prefs, { merge: true });
  return getDoc(userDocument);
}

async function getUserPreferences() {
  const userDocument = await getDocs(collection(db, 'users'), auth.currentUser.uid);
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
  const subList = await addDoc(listsCollection, newPayload);
  return subList;
}

function reactToPrefsChange(store) {
  // this is how to create a reactive firebase collection.
  const prefDoc = query(collection(db, 'globalPreferences'), limit(1));
  return onSnapshot(prefDoc, async (snapshot) => {
    const prefs = [];
    snapshot.forEach((snapdoc) => {
      const pref = snapdoc.data();
      pref.id = snapdoc.id;
      prefs.push(pref);
    });
    if (prefs.length < 1) return;

    const { defaultColor, defaultStateGroup } = prefs[0];
    const stateGroup = await getDoc(defaultStateGroup);
    store.commit('setGlobalPreferences', {
      defaultColor,
      defaultStateGroup: { ...stateGroup.data(), id: stateGroup.id },
    });
  });
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
  getListBySlug,
  updateUserItemStates,
  computeSubListPath,
  reactToPrefsChange,
};
