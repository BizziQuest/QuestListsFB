import LogOut from '@/components/LogOut.vue';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
import routes from '@/router/routes.js';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper = null;
let app = null;

describe('default state', () => {
  beforeEach(() => {
    // app = localVue.component('App', {
    //   components: { LogOut },
    //   template: `
    //     <v-app data-app="true">
    //       <LogOut />
    //     </v-app>
    //   `,
    // });
    // document.body.setAttribute('data-app', 'true');
    wrapper = mount(LogOut, {
      localVue,
      router,
      vuetify,
      store,
      attachTo: document.body,
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
    // await wrapper.vm.$nextTick();
    requestAnimationFrame(() => {
      AllTheTooltip = wrapper.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.wrappers[0].html()).toContain('Log Out');
      done();
    });
  });
});
