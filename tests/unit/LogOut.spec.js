import LogOut from '@/components/LogOut.vue';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import store from '@/store';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import Vuetify from 'vuetify';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper = null;
let app = null;

describe('default state', () => {
  beforeEach(() => {
    wrapper = mount(LogOut, {
      localVue,
      router,
      vuetify,
      store,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should render the correct text', async () => {
    expect(wrapper.text()).toBe('exit_to_app');
  });
  it('should show the correct tooltip when hovering over the log out icon', async (done) => {
    let AllTheTooltip = wrapper.findAllComponents({ name: 'VTooltip' });
    const AllTheButtons = wrapper.findAllComponents({ name: 'VBtn' });
    await AllTheButtons.wrappers[0].trigger('mouseenter');
    requestAnimationFrame(() => {
      AllTheTooltip = wrapper.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.wrappers[0].html()).toContain('Log Out');
      expect('Unable to locate target [data-app]').toHaveBeenTipped();
      done();
    });
  });
});
