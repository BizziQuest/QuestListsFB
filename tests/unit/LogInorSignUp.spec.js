import LogInorSignUp from '@/components/LogInorSignUp.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
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
  it('should render the header', () => {
    const wrapper = shallowMount(LogInorSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    expect(wrapper.text()).toContain('Log In or Sign Up');
  });
});
