import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import App from '@/App.vue'
import VueRouter from 'vue-router';
import routes from '@/router/routes';

const localVue = createLocalVue();
localVue.use(VueRouter)
// localVue.use(Vuex);
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(Vuetify);

let wrapper;

beforeEach(() => {
  // const state = {
  //   messages: [],
  //   currentUser: {
  //     avatar: '/img/unknown_user.svg', // when we set the user in the store, we default to this.
  //     displayName: null,
  //     email: 'tersterson3@test.com',
  //     emailVerified: false,
  //     uid: 'UUID123456',
  //     useGravatar: false,
  //   },
  //   globalPreferences: {}
  // };
  // const localStore = new Vuex.Store({
  //   getters: { getGlobalPreferences: (state) => state.globalPreferences },
  //   state,
  //   actions: { fetchLists: jest.fn() }
  // });
  wrapper = mount(App, {
    localVue,
    router,
    vuetify,
    // store: localStore,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('smoother ux transition', () => {
  describe('transitioning between lists view and edit info page (should be less than 0.3 seconds)', () => {
    it('lists view should have the proper classes when leaving', async () => {
      const listsView = wrapper.find('.lists-view');
      await wrapper.vm.$router.push('/editinfo');
      expect(listsView.classes()).toContain('router-anim-leave');
    });
    it('profile view should have the proper classes when entering', async () => {
      await wrapper.vm.$router.push('/editinfo');
      const profileView = wrapper.find('.editinfo');
      expect(profileView.classes()).toContain('router-anim-enter');
    })
  });
});
