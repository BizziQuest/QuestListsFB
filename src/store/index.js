import Vue from 'vue';
import Vuex from 'vuex';
import { auth } from '../main'; // eslint-disable-line import/no-cycle

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    setUser(state, payload) {
      // this one is thorwing an error
      // state.user = { ...null} ==> state.user = {}
      if (payload) {
        state.user = { ...payload };
      } else state.user = null;


      // the following one will have issue if obj includes objs?
      // state.user = JSON.parse(JSON.stringify(payload));
    },
  },
  actions: {
    async signupUser({ commit }, payload) {
      try {
        const cred = await auth.createUserWithEmailAndPassword(payload.email, payload.password);
        console.log(cred);
        commit('setUser', payload);
      } catch (error) {
        console.log(error);
      }
    },
    async loginUser({ commit }, payload) {
      try {
        const cred = await auth.signInWithEmailAndPassword(payload.email, payload.password);
        console.log(cred);
        commit('setUser', payload);
      } catch (error) {
        console.log(error);
      }
    },

    async logOut({ commit }) {
      try {
        const cred = await auth.signOut();
        console.log('logout store', cred);
        commit('setUser', null);
      } catch (error) {
        console.log(error);
      }
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', payload);
    },
  },
});
