import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import { saveListItems, getListBySlug, getListItems } from '../../src/firebase';
jest.mock('../../src/firebase.js');
// import toHaveBeenWarnedInit from '../toHaveBeenWarned';

// toHaveBeenWarnedInit();

// Vue.use(vuetify);

let wrapper = null;

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(Vuetify);

const elem = document.createElement('div');
if (document.body) {
  document.body.appendChild(elem);
}
beforeEach(() => {
  const state = {
    messages: [],
    currentUser: {
      avatar: '/img/unknown_user.svg', // when we set the user in the store, we default to this.
      displayName: null,
      email: 'tersterson3@test.com',
      emailVerified: false,
      uid: 'UUID123456',
      useGravatar: false,
    },
    globalPreferences: {},
  };
  const localStore = new Vuex.Store({
    getters: { getGlobalPreferences: (s) => s.globalPreferences },
    state,
    actions: { fetchLists: jest.fn() },
  });

  wrapper = shallowMount(App, {
    localVue,
    router,
    store: localStore,
    propsData: { },
    attachTo: elem,
  });
});

// afterEach(() => {
//   wrapper.destroy();
// });

describe('App.vue', () => {
  it('renders a single v-app element', () => {
    expect(wrapper.findAll('v-app-stub').length).toBe(1);
  });
  it('renders the left menu drawer', () => {
    expect(wrapper.findAll('drawer-menu-stub').length).toBe(1);
  });
  it('renders the bottom drawer menu bar', () => {
    expect(wrapper.findAll('bottom-drawer-menu-stub').length).toBe(1);
  });
  it('renders the router view', () => {
    expect(wrapper.findAll('router-view-stub').length).toBe(1);
  });
  it('shows a notification when the app has been updated', async () => {
    expect(wrapper.find('[test-update-notification]')).toBeFalsy();
    await wrapper.vm.trigger('swUpdate', {});
    expect(wrapper.find('[test-update-notification]').exists()).toBe(true);
  });
});

/// NOTE:
// mock firebase
// mock firebase.auth.currentUser to return fake object with user's properties, including emailVerified
