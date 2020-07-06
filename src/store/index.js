import Vue from 'vue';
import Vuex from 'vuex';
import { auth, globalPreferences, listsCollection } from '../firebase';

Vue.use(Vuex);

const testLists = [
  {
    title: 'Test One',
    description: 'Some random description.',
    bgColor: '#ff00ff',
    listItems: [
      {
        text: 'Item 1',
        state: 'Done',
      },
      {
        text: 'Item 2',
        state: 'Not Done',
      },
    ],
  },
  {
    title: 'Test Two',
    description: 'Some random description.',
    bgColor: '#ff0000',
    listItems: [
      {
        text: 'Item 1',
        state: 'Done',
      },
      {
        text: 'Item 2',
        state: 'Not Done',
      },
    ],
  },
  {
    title: 'Test Three',
    description: 'Some random description.',
    bgColor: '#ffff00',
    listItems: [
      {
        text: 'Item 1',
        state: 'Done',
      },
      {
        text: 'Item 2',
        state: 'Not Done',
      },
    ],
  },
  {
    title: 'Test Four',
    description: 'Some random description.',
    bgColor: '#465362',
    listItems: [
      {
        text: 'Item 1',
        state: 'Done',
      },
      {
        text: 'Item 2',
        state: 'Not Done',
      },
    ],
  },
];

const defaultState = {
  user: {
    avatar: '',
    displayName: '',
    email: '',
  },
  itemStates: ['Done', 'Not Done'],
  lists: testLists,
};

const store = new Vuex.Store({
  state: {
    currentUser: null,
    lists: null,
    globalPreferences: [],
  },
  getters: {
    user: (state) => state.currentUser,
    lists: (state) => state.lists,
    globalPreferences: (state) => state.globalPreferences,
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
    createAList(state, payload) {
      if (payload) {
        const list = {};
        list.title = payload.title;
        list.bgColor = payload.bgColor;
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
    async loginUser(_, payload) {
      try {
        await auth.signInWithEmailAndPassword(payload.email, payload.password);
      } catch (error) {
        console.debug(error);
      }
    },

    async logOut({ commit }) {
      try {
        // const cred =
        await auth.signOut();
        // console.debug('logout store', cred);
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
    createAList({ commit }, payload) {
      commit('createAList', payload);
      commit('resetStates');
    },
    resetStates({ commit }) {
      commit('resetStates');
    },
    updateUserInfo({ commit }, payload) {
      commit('updateUserInfo', payload);
    },
    async editForm({ commit }, payload) {
      const response = await auth.currentUser.updateProfile({
        displayName: payload.displayName,
        photoURL: payload.avatar,
      });
      console.log(response, auth.currentUser);
      // eslint-disable-next-line no-alert
      alert(`${payload.email} and ${payload.displayName} Was edited`);
      commit('setUser', payload);
    },
    async getLists({ commit }) {
      const lists = [];
      const fbLists = await listsCollection.limit(10).get();
      fbLists.forEach(async (doc) => {
        const list = doc.data();
        lists.push(list);
      });
      commit('setLists', lists);
      // commit('setLists', []);
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
  const state = await prefs[0].defaultState.get();
  const { stateOrder, states } = state.data();
  const pref = { defaultColor: prefs[0].defaultColor, defaultState: states[stateOrder[0]] };

  store.commit('setGlobalPreferences', pref);
});

export default store;
