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
  stateGroupsCollection,
  googleOAuthLogin,
} from '../firebase';

Vue.use(Vuex);

const defaultState = {
  currentUser: {
    avatar: '',
    displayName: '',
    email: '',
    emailVerified: false,
  },
  lists: [],
};

const store = new Vuex.Store({
  state: {
    currentUser: null,
    lists: null,
    currentList: { },
    stateGroups: [],
    globalPreferences: {
      defaultColor: '#000000',
      defaultStateGroup: {
        name: 'Default State',
        description: 'NOTE: the default state has not loaded from the server yet.',
        states: [
          {
            color: '#00ff00',
            icon: 'mdi-checkbox-blank-outline',
            name: 'Not Done',
            shortName: 'notDone',
            value: '0',
            order: 0,
          }, {
            color: '#00ff00',
            icon: 'mdi-checkbox-marked-outline',
            name: 'Done',
            shortName: 'done',
            value: '1',
            order: 1,
          }],
      },
    },
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getCurrentList: (state) => state.currentList,
    getAllLists: (state) => state.lists,
    getGlobalPreferences: (state) => state.globalPreferences,
  },
  mutations: {
    setUser(state, user) {
      if (user) {
        state.currentUser = {
          id: user.uid,
          email: user.email,
          displayName: 'New Member',
          avatar: '/img/unknown_user.svg',
          emailVerified: user.emailVerified,
        };
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
  },
  actions: {
    async signupUser(_, payload) {
      await auth.createUserWithEmailAndPassword(payload.email, payload.password);
      if (auth.currentUser) {
        await auth.currentUser.sendEmailVerification();
      }
    },
    // underscore is a placeholder for a variable that should be there, but is not used
    // example: [one, _, three, _, _, six] = [1,2,3, 4,5,6]
    async loginUser(_, { email = '', password = '' } = {}) {
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        console.warn(error);
      }
    },

    async googleSigninoAuth() {
      try {
        const result = await auth.signInWithPopup(googleOAuthLogin);
        const token = result.credential.accessToken;
        const { user } = result;
        console.log(token);
        console.log(user);
      } catch (error) {
        console.warn(error);
      }
    },

    async logOut({ commit }) {
      try {
        await auth.signOut();
        await auth.currentUser.reload();
        commit('setUser', { ...defaultState.user });
      } catch (error) {
        console.warn(error);
      }
    },
    authenticationChanged({ commit }, payload) {
      commit('setUser', payload);
    },
    async addStateGroup({ commit, state }, stateGroupData) {
      // TODO: check for groups that have the current values and use that one instead.
      const stateSkeleton = state.globalPreferences.defaultStateGroup.states[0];
      // TODO: refactor this to handle actual states
      const states = stateGroupData.states.map((stateBody) => ({ ...stateSkeleton, ...stateBody }));
      const payload = { ...stateGroupData, states };
      const stateGroupRef = await stateGroupsCollection.add(payload);

      commit('addState', stateGroupData);
      return stateGroupRef;
    },
    async createList({ dispatch }, listData) {
      const stateGroupRef = await dispatch('addStateGroup', listData.stateGroup);
      listsCollection.add({ ...listData, stateGroup: stateGroupRef });
    },
    updateUserInfo({ commit }, payload) {
      commit('updateUserInfo', payload);
    },
    async fetchLists({ commit }, { limit = 10 } = {}) {
      listsCollection.limit(limit).onSnapshot((fbLists) => {
        const lists = [];
        fbLists.forEach(async (doc) => {
          const list = doc.data();
          list.id = doc.id;
          lists.push(list);
        });
        commit('setLists', lists);
      });
    },
    async saveProfile({ commit }, payload) {
      try {
        await auth.currentUser.updateProfile({
          displayName: payload.displayName,
          photoURL: payload.avatar,
        });
        commit('setUser', payload);
      } catch (error) {
        console.warn('saveProfile', error);
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

  const { defaultColor, defaultStateGroup } = prefs[0];

  const stateGroup = await defaultStateGroup.get();
  store.commit('setGlobalPreferences', {
    defaultColor,
    defaultStateGroup: { ...stateGroup.data(), id: stateGroup.id },
  });
});

export default store;
