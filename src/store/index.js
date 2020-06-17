import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '../main'; // eslint-disable-line import/no-cycle

Vue.use(Vuex);

const testLists = [
  {
    title: 'Test One',
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
    bgColor: '#ff00ab',
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

export default new Vuex.Store({
  state: {
    user: null,
    itemStates: ['Done', 'Not Done'],
    lists: testLists,
  },
  getters: {
    user: (state) => state.user,
    itemStates: (state) => state.itemStates,
    lists: (state) => state.lists,
  },
  mutations: {
    setUser(state, payload) {
      if (payload) {
        state.user = { ...payload };
      } else {
        state.user = null;
      }
    },
    resetStates(state) {
      state.itemStates = ['Done', 'Not Done'];
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
    async signupUser({ commit }, payload) {
      try {
        await auth.createUserWithEmailAndPassword(payload.email, payload.password);
        commit('setUser', payload);
      } catch (error) {
        console.log(error);
      }
    },
    async loginUser({ commit }, payload) {
      try {
        await auth.signInWithEmailAndPassword(payload.email, payload.password);
        commit('setUser', payload);
      } catch (error) {
        console.log(error);
      }
    },

    async logOut({ commit }) {
      try {
        const cred = await auth.signOut();
        console.debug('logout store', cred);
        commit('setUser', null);
      } catch (error) {
        console.log(error);
      }
    },
    autoSignIn({ commit }, payload) {
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
  },
});
