import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import routes from '@/router/routes';
import LogOut from '@/components/LogOut.vue';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

jest.mock('../../src/firebase.js');

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper = null;

describe('default state', () => {
  beforeEach(() => {
    wrapper = mount(LogOut, {
      localVue,
      router,
      vuetify,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should render the correct text', async () => {
    expect(wrapper.text()).toBe('exit_to_app');
  });
  it('should show the correct tooltip when hovering over the log out icon', async () => {
    let logoutButton = wrapper.find('[test-logout-button]');
    await logoutButton.trigger('mouseenter');
    await logoutButton.trigger('mouseover');
    const tooltip = wrapper.find('[test-logout-tooltip]');
    expect(tooltip.exists()).toBe(true);
  });
});
