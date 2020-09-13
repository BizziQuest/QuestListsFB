import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import vuetify from 'vuetify';
import router from '@/router';
import store from '@/store';

let wrapper = null;

beforeEach(() => {
  const localVue = createLocalVue();
  localVue.use(vuetify);

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
  it('renders the top menu bar', () => {
    expect(wrapper.findAll('top-menu-bar-stub').length).toBe(1);
  });
  it('renders the drawer menu bar', () => {
    expect(wrapper.findAll('drawer-menu-bar-stub').length).toBe(1);
  });
  it('renders the router view', () => {
    expect(wrapper.findAll('router-view-stub').length).toBe(1);
  });
});
