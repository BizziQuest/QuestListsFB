import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '../main'; // eslint-disable-line import/no-cycle

Vue.use(Vuex);

const testLists = [
  {
    title: 'Test One',
    description: 'Some random description.',
    bgColor: '#ff00ff',
    listItems: [
      {
        text: 'Item 1',
        state: 'done',
      },
      {
        text: 'Item 2',
        state: 'people',
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
        state: 'done',
      },
      {
        text: 'Item 2',
        state: 'face',
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
        state: 'done',
      },
      {
        text: 'Item 2',
        state: 'face',
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
        state: 'done',
      },
      {
        text: 'Item 2',
        state: 'face',
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
  itemStates: ['done', 'face'],
  lists: testLists,
};

export default new Vuex.Store({
  state: {
    user: null,
    itemStates: ['done', 'face'],
    lists: testLists,
  },
  getters: {
    user: (state) => state.user,
    itemStates: (state) => state.itemStates,
    lists: (state) => (state.user && state.user.id ? state.lists : []),
    list: (state) => (title) => (state.lists.find((list) => list.title === title)),
  },
  mutations: {
    setUser(state, payload) {
      console.debug('Set User Payload', payload);
      if (payload) {
        state.user = { ...payload };
      }
    },
    resetStates(state) {
      state.itemStates = ['done', 'face'];
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
        list.listItems = [{ text: '', state: state.itemStates[0] }];
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
      // commit('resetStates');
      commit('createAList', payload);
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
