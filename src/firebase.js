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
const fbApp = firebase.initializeApp(firebaseConfig);
const nodeEnv = process.env.NODE_ENV;
const fbAnalytics = !(nodeEnv === 'test' || nodeEnv === 'development') ? firebase.analytics() : null;
const auth = fbApp.auth();
if (process.env.VUE_APP_FIREBASE_AUTH_HOST) {
  auth.useEmulator(process.env.VUE_APP_FIREBASE_AUTH_HOST, { disableWarnings: true });
}
const db = fbApp.firestore();
const { currentUser } = auth;

// // firebase settings go here
// const settings = { };

// if (process.env.NODE_ENV !== 'production') {
db.settings({
  host: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  ssl: false,
  merge: true,
});
// }

const globalPreferences = db.collection('globalPreferences');

const listsCollection = db.collection('lists');
const stateGroupsCollection = db.collection('stateGroups');
const usersCollection = db.collection('users');
const userStatesCollection = db.collection('userListItemStates');

const googleOAuthLogin = new firebase.auth.GoogleAuthProvider();
const facebookOAuthLogin = new firebase.auth.FacebookAuthProvider();

async function getUserDocumentRef() {
  const userDocument = db.collection('users').doc(auth.currentUser.uid);
  if (!userDocument.get().exists) await userDocument.set({}, { merge: true });
  return userDocument;
}

async function updateUserItemStates(listId, items) {
  const userDocument = await getUserDocumentRef();
  const itemStates = items.reduce((states, item, itemIdx) => {
    const state = { ...item.state };
    if (!state.value) return states;
    return { ...states, [itemIdx]: { value: state.value, title: item.title } };
  }, {});
  const userStatesDocument = userDocument.collection('states').doc(listId);
  await userStatesDocument.set(itemStates);
  return userStatesDocument.get();
}

async function getListBySlug(slug) {
  const doc = listsCollection.where('slug', '==', slug);
  return doc.get();
}

async function getListItems(fbList) {
  const listItemsCollection = db.collection(`lists/${fbList.id}/listItems`);
  const currentUserStatesCollection = await db.collection(`users/${auth.currentUser.uid}/states`).doc(fbList.id).get();
  let userStates = {};
  if (currentUserStatesCollection.exists) {
    userStates = currentUserStatesCollection.data();
  }
  console.info(currentUserStatesCollection, userStates);
  let listItems = [];
  // to accommodate longer lists, we use multiple documents in a
  // listItem collection
  const listItemsPartials = await listItemsCollection.get();
  listItemsPartials.forEach(async (listItemsPartialObj) => {
    const listItemsPartial = listItemsPartialObj.data();
    listItemsPartial.id = listItemsPartialObj.id;

    // step through each list partial
    //   step though each user state partial
    //     if the title is the same, that is the matched item
    //       remove the found item form the user states

    if (Object.hasOwnProperty.call(listItemsPartial, 'data')) {
      Oject.entries(listItemsPartial).reduce(([index, listItem], allListItems) => {
        let foundIndex = -1;
        const userStateData = Object.entries(userStates).find(([index, userState]) => {
          debugger;
          if (item.data.title === userState.title) {
            foundIndex = index;
            return true;
          }
          return false;
        });
        return {...allListItems, key: listItem}
        }, {});
      debugger;
      if (foundIndex > -1) delete userStates[foundIndex];
      const stateData = { ...(item.data?.state || {}), ...userStateData };
      listItems = listItems.concat({ ...item.data, state: stateData });
    }
  });
  debugger;
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
    await listItemsCollection.doc(docID).set({ data: sanitizedItems });
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
  // TODO: sort DESC by created date
  const allListsWithTitle = listsCollection.where('title', '==', title);
  let lists = await allListsWithTitle.get();
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
  getListBySlug,
  updateUserItemStates,
};
