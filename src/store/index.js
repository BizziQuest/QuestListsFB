/** This file should follow the guidelines outlined at
 * https://docs.vuestorefront.io/guide/vuex/vuex-conventions.html
 *
 * With the following exceptions:
 * 1. mutations should be camel-cased, not upper-cased. (they aren't constants like in other Flux implementations.)
 * 2. to reset a state to it's default value, use the mutation name: reset<state>
 * 3. Since we are a list management application, we can use "list," but it must refer to an actual List object.
 *    likewise, "lists" must refer to an orderable list of List objects.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import {
  auth,
  globalPreferences,
  listsCollection,
} from '../firebase';

Vue.use(Vuex);

const defaultState = {
  currentUser: {
    avatar: '',
    displayName: '',
    email: '',
  },
  lists: [],
};

const store = new Vuex.Store({
  state: {
    currentUser: null,
    lists: null,
    currentList: { },
    globalPreferences: {},
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getCurrentList: (state) => state.currentList,
    getAllLists: (state) => state.lists,
    getGlobalPreferences: (state) => state.globalPreferences,
  },
  mutations: {
    setUser(state, payload) {
      if (payload) {
        state.currentUser = { ...payload };
      }
    },
    setLists(state, payload) {
      if (payload) {
        state.lists = payload;
      }
    },
    setGlobalPreferences(state, prefs) {
      state.globalPreferences = { ...prefs };
    },
    addState(state, payload) {
      if (payload) {
        state.itemStates.push(payload);
      }
    },
    addList(state, payload) {
      if (payload) {
        const list = {};
        list.title = payload.title;
        list.bgColor = payload.bgColor;
        list.listItems = [{ text: '', state: 'Not Done' }];
        state.lists.push(list);
      }
    },
  },
  actions: {
    async signupUser(_, payload) {
      try {
        const cred = await auth.createUserWithEmailAndPassword(payload.email, payload.password);
        console.log('cred info', cred);
      } catch (error) {
        console.log(error);
      }
    },
    // underscore is a placeholder for a variable that should be there, but is not used
    // example: [one, _, three, _, _, six] = [1,2,3, 4,5,6]
    async loginUser(_, { email = '', password = '' } = {}) {
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        console.debug(error);
      }
    },

    async logOut({ commit }) {
      try {
        await auth.signOut();
        commit('setUser', { ...defaultState.user });
      } catch (error) {
        console.log(error);
      }
    },
    authenticationChanged({ commit }, payload) {
      commit('setUser', payload);
    },
    addState({ commit }, payload) {
      commit('addState', payload);
    },
    createList({ commit }, payload) {
      commit('addList', payload);
      commit('resetStates');
    },
    resetStates({ commit }) {
      commit('resetStates');
    },
    updateUserInfo({ commit }, payload) {
      commit('updateUserInfo', payload);
    },
    async editForm({ commit }, payload) {
      await auth.currentUser.updateProfile({
        displayName: payload.displayName,
        photoURL: payload.avatar,
      });
      commit('setUser', payload);
    },
    async fetchLists({ commit }, { limit = 10 } = {}) {
      const lists = [];
      const fbLists = await listsCollection.limit(limit).get();
      fbLists.forEach(async (doc) => {
        const list = doc.data();
        list.id = doc.id;
        lists.push(list);
      });
      commit('setLists', lists);
    },
    async saveProfile({ commit }, payload) {
      try {
        const response = await auth.currentUser.updateProfile({
          displayName: payload.displayName,
          photoURL: payload.avatar,
        });
        console.log(response, auth.currentUser);
        // eslint-disable-next-line no-alert
        alert(`${payload.email} and ${payload.displayName} Was edited`);
        commit('setUser', payload);
      } catch (error) {
        console.log('saveProfile', error);
      }
    },
  },
});

// this is how to create a reactive firebase collection.
globalPreferences.onSnapshot(async (snapshot) => {
  const prefs = [];
  snapshot.forEach((doc) => {
    const pref = doc.data();
    pref.id = doc.id;

    prefs.push(pref);
  });
  if (prefs.length < 1) return;

  const state = await prefs[0].defaultState.get();
  const { order, states } = state.data();
  const pref = {
    defaultColor: prefs[0].defaultColor,
    defaultState: (order && order.length < 1) ? null : states[order[0]],
    defaultStates: states,
  };

  store.commit('setGlobalPreferences', pref);
});

export default store;
