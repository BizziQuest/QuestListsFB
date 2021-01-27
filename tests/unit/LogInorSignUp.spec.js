import LogInOrSignUp from '@/components/LogInorSignUp.vue';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
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

describe('login or sign up', () => {
  it('should render the header', async () => {
    const wrapper = shallowMount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    expect(wrapper.text()).toContain('Log In or Sign Up');
  });
  it('should warn when not giving a username', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Username is required');
  });
  it('should warn when not giving a username', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Password is required');
  });
});
