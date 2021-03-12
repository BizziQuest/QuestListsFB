import LogInOrSignUp from '@/components/Menus/LoginOrSignup.vue';
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
  it('should warn when not giving a email', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is required');
    await wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is required');
  });
  it('should warn when giving an invalid email', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is in an invalid format');
    wrapper.find('[test-email-field]').setValue('invalid.email@!!@you.com');
    await wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is in an invalid format');
  });
  it('should warn when not giving a password', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password is required');
    await wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Password is required');
  });
});
describe('Signing Up As A New User', () => {
  it('should warn when not giving a email', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is required');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is required');
  });
  it('should warn when giving an invalid email', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is in an invalid format');
    wrapper.find('[test-email-field]').setValue('invalid.email@!!@you.com');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is in an invalid format');
  });
  it('should warn when not giving a password', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password is required');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Password is required');
  });
  it('should warn when password is invalid', async () => {
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password must be at least 8 characters.');
    await wrapper.find('input[test-password-field]').setValue('567');
    expect(wrapper.text()).toContain('3');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Password must be at least 8 characters');
  });
  it('should submit form when email and password is valid', async () => {
    const actions = {
      signupUser: jest.fn(),
      loginUser: jest.fn(),
    };
    const localStore = new Vuex.Store({
      actions,
    });
    const wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      vuetify,
      store: localStore,
    });
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password is required.');
    expect(wrapper.text()).not.toContain('Password must be at least 8 characters.');
    expect(wrapper.vm.dialog).toBe(true);
    expect(wrapper.find('form').isVisible()).toBe(true);
    await wrapper.find('input[test-email-field]').setValue('valid@test.com');
    await wrapper.find('input[test-password-field]').setValue('123456789');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    await wrapper.vm.$nextTick();
    expect(actions.signupUser).toHaveBeenCalled();
    expect(wrapper.vm.dialog).toBe(false);
    // expect(wrapper.vm.action).toBe(false);
    expect(wrapper.text()).not.toContain('Password is required.');
    expect(wrapper.text()).not.toContain('Password must be at least 8 characters.');
    expect(wrapper.find('form').isVisible()).toBe(false);
  });
});
