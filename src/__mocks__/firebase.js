/* eslint-disable no-undef */

const appCheck = jest.fn(() => Promise.resolve({}));
const auth = jest.fn(() => Promise.resolve({ currentUser: {} }));
const computeSubListPath = jest.fn(() => Promise.resolve(''));
const createList = jest.fn(() => ({}));
const currentUser = jest.fn(() => Promise.resolve({}));
const db = jest.fn(() => Promise.resolve({}));
const ensureSlugUniqueness = jest.fn(() => Promise.resolve({}));
const facebookOAuthLogin = jest.fn(() => Promise.resolve({}));
const fbAnalytics = jest.fn(() => Promise.resolve({}));
const fbApp = jest.fn(() => Promise.resolve({}));
const fetchQuestLists = jest.fn((obj) => Promise.resolve([obj.callback()]));
const getListBySlug = jest.fn(() => Promise.resolve({}));
const getListItems = jest.fn(() => Promise.resolve([]));
const getListStates = jest.fn(() => Promise.resolve([]));
const getOrderedCollectionAsList = jest.fn(() => Promise.resolve({}));
const getStateGroup = jest.fn(() => Promise.resolve({ }));
const getUserPreferences = jest.fn(() => Promise.resolve({}));
const globalPreferences = jest.fn(() => Promise.resolve({ }));
const globalPrefRef = jest.fn(() => Promise.resolve({ currentUser: {} }));
const googleOAuthLogin = jest.fn(() => Promise.resolve({ }));
const listsCollection = jest.fn(() => Promise.resolve({ }));
const reactToPrefsChange = jest.fn(() => Promise.resolve(''));
const saveListItems = jest.fn(() => Promise.resolve([]));
const saveUserPreferences = jest.fn(() => Promise.resolve({ }));
const stateGroupsCollection = jest.fn(() => Promise.resolve({ }));
const updateUserItemStates = jest.fn(() => Promise.resolve({ }));
const usersCollection = jest.fn(() => Promise.resolve({ }));
const userStatesCollection = jest.fn(() => Promise.resolve({ }));

export {
  appCheck,
  auth,
  computeSubListPath,
  createList,
  currentUser,
  db,
  ensureSlugUniqueness,
  facebookOAuthLogin,
  fbAnalytics,
  fbApp,
  fetchQuestLists,
  getListBySlug,
  getListItems,
  getListStates,
  getOrderedCollectionAsList,
  getStateGroup,
  getUserPreferences,
  globalPreferences,
  globalPrefRef,
  googleOAuthLogin,
  listsCollection,
  reactToPrefsChange,
  saveListItems,
  saveUserPreferences,
  stateGroupsCollection,
  updateUserItemStates,
  usersCollection,
  userStatesCollection,
};
