import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '../main'; // eslint-disable-line import/no-cycle

Vue.use(Vuex);

const defaultState = {
  user: null,
  itemStates: ['Done', 'Not Done'],
  lists: [],
};

export default new Vuex.Store({
  state: { ...defaultState },
  getters: {
    user: (state) => state.user,
    itemStates: (state) => state.itemStates,
    lists: (state) => state.lists,
  },
  mutations: {
    setUser(state, payload) {
      console.debug('Set User Payload', payload);
      if (payload) {
        state.user = { ...payload };
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
    async signupUser(_, payload) {
      try {
        const cred = await auth.createUserWithEmailAndPassword(payload.email, payload.password);
        console.log('cred info', cred);
        // cred.data.user
        // const user = auth.currentUser;
        // if (user) {
        //   const updateInfo = await user.updateProfile({
        //     displayName: 'Guest',
        //     photoURL: 'https://i.ya-webdesign.com/images/default-avatar-png.png',
        //   });
        //   console.debug('updateInfo', updateInfo);
        // }

        // const newUser = {
        //   id: cred.user.uid,
        //   email: payload.email,
        //   displayName: user.displayName,
        //   avatar: user.photoURL,
        // };
        // commit('setUser', newUser);
      } catch (error) {
        console.log(error);
      }
      // auth.createUserWithEmailAndPassword(payload.email, payload.password)
      //   .then((dataCred) => {
      //     dataCred.user.updateProfile({
      //       displayName: 'Guest',
      //       photoURL: 'https://i.ya-webdesign.com/images/default-avatar-png.png',
      //     });
      //     return dataCred;
      //   }).then((dataCred) => {
      //     const newUser = {
      //       id: dataCred.user.uid,
      //       email: payload.email,
      //       displayName: dataCred.user.displayName,
      //       avatar: dataCred.user.photoURL,
      //     };
      //     commit('setUser', newUser);
      //   }).catch((error) => {
      //     console.log(error);
      //   });
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
