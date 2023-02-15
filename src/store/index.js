/** This file should follow the guidelines outlined at
 * https://docs.vuestorefront.io/guide/vuex/vuex-conventions.html
 *
 * With the following exceptions:
 * 1. mutations should be camel-cased, not upper-cased. (they aren't constants like in other Flux implementations.)
 * 2. to reset a state to it's default value, use the mutation name: reset<state>
 * 3. Since we are a list management application, we can use "list," but it must refer to an actual List object.
 *    likewise, "lists" must refer to an orderable list of List objects.
 */

import {createStore} from 'vuex';
import { getDoc } from 'firebase/firestore';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import router from '../router';
import { getAvatarForUser } from '../util';
import {
  reactToPrefsChange,
  auth,
  createList,
  createStateGroup,
  googleOAuthLogin,
  facebookOAuthLogin,
  saveUserPreferences,
  getUserPreferences,
  fetchQuestLists,
  getRecentlyUsedLists,
} from '../firebase';

import { algoliaIndex } from '../algolia';

const defaultState = {
  currentUser: {
    avatar: null,
    displayName: null,
    email: null,
    emailVerified: false,
    uid: undefined,
    useGravatar: false,
  },
  lists: [],
  message: [
    {
      text: '',
      type: 'none', // it can be error, info, or warning
    },
  ],
};

const store = createStore({
  state: {
    pageBackgroundColor: null,
    currentUser: defaultState.currentUser,
    lists: defaultState.lists,
    messages: [],
    currentList: {},
    stateGroups: [],
    globalPreferences: {
      defaultColor: '#000000',
      defaultStateGroup: {
        name: 'Default State',
        description: 'NOTE: the default state has not loaded from the server yet.',
        states: [
          {
            color: '#ffffff',
            icon: 'mdi-checkbox-blank-outline',
            text: 'Not Done',
            value: '0',
            order: 0,
          },
          {
            color: '#ffffff',
            icon: 'mdi-checkbox-marked-outline',
            text: 'Done',
            value: '1',
            order: 1,
          },
        ],
      },
    },
    recentQuests: [
      {
        title: 'No Recent Quests',
        icon: 'mdi-heart',
        slug: null,
      },
    ],
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getUserAvatar: (state) => getAvatarForUser(state.currentUser),
    getCurrentList: (state) => state.currentList,
    getAllLists: (state) => state.lists,
    getGlobalPreferences: (state) => state.globalPreferences,
  },
  mutations: {
    setPageBackgroundColor(state, color) {
      state.pageBackgroundColor = color;
    },
    setUser(state, user) {
      state.currentUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'New Member',
        avatar: user.avatar || '/img/unknown_user.svg',
        emailVerified: user.emailVerified,
        useGravatar: user.useGravatar,
      };
    },
    setLists(state, payload) {
      if (payload) {
        state.lists = payload;
      }
    },
    setMessages(state, payload) {
      state.messages = payload;
    },
    setGlobalPreferences(state, prefs) {
      state.globalPreferences = { ...prefs };
    },
    addState(state, payload) {
      if (payload) {
        state.stateGroups.push(payload);
      }
    },
    addList(state, payload) {
      if (payload) {
        const list = {};
        list.title = payload.title;
        list.bgColor = payload.color;
        state.lists.push(list);
      }
    },
    setRecentQuests(state, payload) {
      state.recentQuests = payload;
    },
  },
  actions: {
    notify({ state, commit }, message) {
      const { text, type, timeout = 2000 } = message;
      const messageArray = [];
      messageArray.push({ text, type, timeout });
      commit('setMessages', [...state.messages, ...messageArray]);
    },
    async signupUser({ dispatch }, payload) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        const additionalUserInfo = getAdditionalUserInfo(userCred);
        if (additionalUserInfo.isNewUser) {
          dispatch('notify', { text: 'welcome to world of possibilities', type: 'info' });
          if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
          }
        }
      } catch (error) {
        dispatch('notify', { text: error, type: 'error' });
      }
    },
    // underscore is a placeholder for a variable that should be there, but is not used
    // example: [one, _, three, _, _, six] = [1,2,3, 4,5,6]
    async loginUser({ dispatch }, { email = '', password = '' } = {}) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified) {
          dispatch('notify', {
            text: 'please do not forget to verify your email',
            type: 'error',
            timeout: 3000,
          });
        }
        dispatch('notify', {
          text: 'successful sign in',
          type: 'info',
          timeout: 4000,
        });
      } catch (error) {
        dispatch('notify', { text: error, type: 'error' });
      }
    },

    async googleSigninoAuth({ dispatch }) {
      try {
        const googleInfo = await signInWithPopup(auth, googleOAuthLogin);
        const additionalUserInfo = getAdditionalUserInfo(googleInfo);
        if (additionalUserInfo?.isNewUser) {
          dispatch('notify', { text: 'welcome to world of possibilities', type: 'info' });
        } else {
          dispatch('notify', { text: 'successful sign in', type: 'info' });
        }
      } catch (error) {
        dispatch('notify', { text: error, type: 'error' });
      }
    },
    async faceBookSigninoAuth({ dispatch }) {
      try {
        const facebookInfo = await signInWithPopup(auth, facebookOAuthLogin);
        const additionalUserInfo = getAdditionalUserInfo(facebookInfo);
        if (additionalUserInfo?.isNewUser) {
          dispatch('notify', { text: 'welcome to world of possibilities', type: 'info' });
        } else {
          dispatch('notify', { text: 'successful sign in', type: 'info' });
        }
      } catch (error) {
        dispatch('notify', { text: error, type: 'error' });
      }
    },

    async logOut({ commit, dispatch }) {
      try {
        await signOut(auth);
        commit('setUser', { ...defaultState.user });
        dispatch('notify', { text: 'logged out successfuly', type: 'success' });
      } catch (error) {
        dispatch('notify', { text: error, type: 'error' });
      }
    },
    async authenticationChanged({ commit }, payload) {
      const userPrefs = await getUserPreferences();
      commit('setUser', { ...payload, ...userPrefs });
    },
    async addStateGroup({ commit }, stateGroupData) {
      const stateGroupRef = createStateGroup(stateGroupData);
      commit('addState', stateGroupRef);
    },
    async createList({ state }, listData) {
      let createdDocData = null;
      try {
        createdDocData = await createList(listData, state.globalPreferences.defaultStateGroup);
      } catch (err) {
        console.error(err);
      }
      algoliaIndex.saveObject(
        { ...createdDocData, objectID: createdDocData.id },
      );
      router.push(`/Lists/${createdDocData.slug}`);
    },
    updateUserInfo({ commit }, payload) {
      commit('updateUserInfo', payload);
    },
    async fetchLists({ commit }, options = {}) {
      fetchQuestLists({
        ...options,
        callback: (lists) => {
          commit('setLists', lists);
        },
      });
    },
    async saveProfile({ commit }, payload) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: payload.displayName,
          photoURL: payload.avatar,
        });
        await saveUserPreferences(payload);
        commit('setUser', payload);
      } catch (error) {
        console.warn('saveProfile', error);
      }
    },
    addRecentlyUsedQuest({ commit, state }, newQuest) {
      commit('setRecentQuests', [newQuest, ...state.recentQuests]);
    },
    async getRecentlyUsedQuests({ commit }) {
      const recent = await getRecentlyUsedLists();
      if (recent) {
        commit('setRecentQuests', recent);
      }
    },
  },
});

export const globalPrefRef = reactToPrefsChange(store);

export default store;
