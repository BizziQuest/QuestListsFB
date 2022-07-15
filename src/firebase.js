import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  limit,
  setDoc,
  doc,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import slugify from 'slugify';

// require('dotenv').config();

// firebase init goes here
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  // measurementId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  // messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
};
console.log(firebaseConfig);
if (import.meta.env.NODE_ENV !== 'development') {
  firebaseConfig.measurementId = import.meta.env.VITE_APP_FIREBASE_APP_ID;
  firebaseConfig.messagingSenderId = import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID;
  firebaseConfig.storageBucket = import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET;
} else {
  global.self.FIREBASE_APPCHECK_DEBUG_TOKEN = env.VITE_APP_FIREBASE_APPCHECK_DEBUG_TOKEN;
}
// firebase utils
const fbApp = initializeApp(firebaseConfig);

const nodeEnv = import.meta.env.NODE_ENV;
const fbAnalytics = !(nodeEnv === 'test' || nodeEnv === 'development') ? getAnalytics() : null;
let tappCheck = null;
if (import.meta.env.NODE_ENV !== 'development') {
  tappCheck = initializeAppCheck(fbApp, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: import.meta.env.NODE_ENV === 'production', // refresh app tokens as needed?
  });
}
const appCheck = tappCheck;

const auth = getAuth(fbApp);
if (import.meta.env.VITE_APP_FIREBASE_AUTH_HOST) {
  connectAuthEmulator(auth, import.meta.env.VITE_APP_FIREBASE_AUTH_HOST, { disableWarnings: true });
}

const db = getFirestore();
const { currentUser } = auth;

// // firebase settings go here
// const settings = { };

if (import.meta.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, import.meta.env.VITE_APP_FIREBASE_AUTH_HOST);
  connectFirestoreEmulator(db, import.meta.env.VITE_APP_FIREBASE_DATABASE_HOST, import.meta.env.VITE_APP_FIREBASE_DATABASE_PORT);
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

async function fetchQuestLists({ pageSize = 10, slugs = null, callback = () => {} } = {}) {
  let q = query(listsCollection, limit(pageSize));
  if (slugs && slugs.length > 0) {
    q = query(q, where('slug', 'in', slugs));
  }
  let lists = [];
  onSnapshot(q, (querySnapshot) => {
    lists = [];
    querySnapshot.docs.forEach((fbDoc) => {
      const list = fbDoc.data();
      list.id = fbDoc.id;
      lists.push(list);
    });
    callback(lists);
  });
  return lists;
}

async function getUserDocumentRef() {
  if (!auth.currentUser) return null;
  const userDocument = doc(db, 'users', auth.currentUser.uid);
  if (!userDocument.exists) await setDoc(userDocument, {}, { merge: true });
  return userDocument;
}

async function getRecentlyUsedLists() {
  const userDocument = await getUserDocumentRef();
  if (!userDocument) return null;
  const q = query(collection(userDocument, 'states'), orderBy('updated', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  const docs = [];
  querySnapshot.forEach((ss) => docs.push(ss.data()));
  console.info('recent:', docs);
  return docs;
}

async function updateUserItemStates(list, items) {
  const userDocument = await getUserDocumentRef();
  const itemStates = items.reduce((states, item, itemIdx) => {
    const state = { ...item.state };
    if (!state.value) return states;
    return {
      ...states,
      title: list.title,
      slug: list.slug,
      updated: serverTimestamp(),
      [itemIdx]: { value: state.value, title: item.title },
    };
  }, {});
  const userStatesRef = doc(userDocument, 'states', list.id);
  await setDoc(userStatesRef, itemStates);
  const newStatesDoc = await getDoc(userStatesRef);
  return newStatesDoc;
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
  // TODO: see if size is over 900Kb and create as many docs as necessary
  if (listItemDocs.empty) {
    await addDoc(listItemsCollection, { data: listItems });
  } else {
    let docID = null;
    listItemDocs.forEach(async (document) => {
      docID = document.id;
    });
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
  if (Array.isArray(fbList.stateGroup?.states)) {
    return fbList.stateGroup.states.sort((state) => state.order);
  }
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

async function getDocRefData(ref) {
  return (await getDoc(ref)).data();
}

async function getUserPreferences() {
  const userDocument = await getDocs(collection(db, 'users'), auth.currentUser.uid);
  if (userDocument.exists) return userDocument.data();
  console.warn("User Prefs don't exist: ", auth.currentUser?.uid, userDocument?.path);
  return {};
}
async function createStateGroup(stateGroupData, defaultStateGroup) {
  if (!stateGroupData) return defaultStateGroup;
  // TODO: check for groups that have the current values and use that one instead.
  const defaultStateData = defaultStateGroup.states[0];
  // TODO: refactor this to handle actual states
  const newStateGroupData = {
    name: stateGroupData.name || stateGroupData.states.map((s) => s.text).join(', '),
    description: stateGroupData.description || '',
    states:
      (stateGroupData.states || stateGroupData).map((stateBody) => ({ ...defaultStateData, ...stateBody }))
      || defaultStateGroup.states,
  };

  const stateGroupRef = await addDoc(stateGroupsCollection, newStateGroupData);
  return stateGroupRef;
}
async function updateStateGroup(stateGroupRef, newStateGroupData) {
  if (!newStateGroupData) return stateGroupRef;
  const stateGroupData = (await getDoc(stateGroupRef)).data();
  const updatedStateGroupData = {
    name: newStateGroupData.name || stateGroupData.name || newStateGroupData.map((s) => s.text).join(', '),
    description: newStateGroupData.description || stateGroupData.description || '',
    states: newStateGroupData.states || newStateGroupData || stateGroupData.states,
  };
  await setDoc(stateGroupRef, updatedStateGroupData);
  return stateGroupRef;
}
async function createList(payload, defaultStateGroup) {
  const defaultPayload = {
    title: 'New List',
    color: '#333333',
    description: 'Newly Created List',
    stateGroup: defaultStateGroup,
    createdAt: Date.now(),
    createdBy: auth.currentUser?.uid,
  };
  let newPayload = { ...defaultPayload, ...payload };
  newPayload.slug = await ensureSlugUniqueness(payload.title || defaultPayload.title);
  newPayload.stateGroup = await createStateGroup(newPayload.newStateGroup, defaultStateGroup);
  newPayload = Object.entries(newPayload).reduce((newObj, [k, v]) => {
    if (k === 'newStateGroup') return newObj;
    if (v) newObj[k] = v; // eslint-disable-line no-param-reassign
    return newObj;
  }, {});
  const subList = await addDoc(listsCollection, newPayload);
  return subList;
}
async function saveList(payload) {
  const newPayload = { ...payload };
  if (newPayload.newStateGroup) {
    newPayload.stateGroup = await updateStateGroup(newPayload.stateGroup, newPayload.newStateGroup);
  }
  const safePayload = Object.entries(payload).reduce((newObj, [k, v]) => {
    if (v) newObj[k] = v; // eslint-disable-line no-param-reassign
    return newObj;
  }, {});
  const listDocument = doc(db, 'lists', payload.id);
  await setDoc(listDocument, safePayload, { merge: true });
  return getDoc(listDocument);
}
function getStateGroup(stateGroupsCollectionRef, id) {
  return doc(stateGroupsCollectionRef, id);
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
    if (defaultStateGroup) {
      const stateGroup = await getDoc(defaultStateGroup);
      store.commit('setGlobalPreferences', {
        defaultColor,
        defaultStateGroup: { ...stateGroup.data(), id: stateGroup.id },
      });
      return;
    }
    store.commit('setGlobalPreferences', {
      defaultColor,
    });
  });
}

export {
  appCheck,
  auth,
  computeSubListPath,
  createList,
  createStateGroup,
  currentUser,
  db,
  ensureSlugUniqueness,
  facebookOAuthLogin,
  fbAnalytics,
  fbApp,
  fetchQuestLists,
  getDocRefData,
  getListBySlug,
  getListItems,
  getListStates,
  getOrderedCollectionAsList,
  getRecentlyUsedLists,
  getStateGroup,
  getUserPreferences,
  globalPreferences,
  googleOAuthLogin,
  listsCollection,
  reactToPrefsChange,
  saveList,
  saveListItems,
  saveUserPreferences,
  stateGroupsCollection,
  updateUserItemStates,
  usersCollection,
  userStatesCollection,
};
