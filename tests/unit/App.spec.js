import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import Vue from 'vue';
import vuetify from 'vuetify';
import router from '@/router';
import store from '@/store';
import Vue from 'vue';

Vue.use(vuetify);

Vue.use(vuetify);

let wrapper = null;
const localVue = createLocalVue();

beforeEach(() => {
  wrapper = shallowMount(App, {
    localVue,
    router,
    store,
    propsData: { },
  });
});

afterEach(() => {
  wrapper.destroy();
});

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
});

/// NOTE:
// mock firebase
// mock firebase.auth.currentUser to return fake object with user's properties, including emailVerified
