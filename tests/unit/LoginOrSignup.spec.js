import LogInOrSignUp from '@/components/Menus/LoginOrSignup.vue';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
// import { store, globalPrefRef } from '@/store';
import VueRouter from 'vue-router';
// eslint-disable-next-line import/extensions
// import routes from '@/router/routes.js';
// import router from '@/router';
import Vuetify from 'vuetify';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

toHaveBeenWarnedInit();

Vue.use(Vuetify);
const localVue = createLocalVue();
// const router = new VueRouter({ routes });
localVue.use(VueRouter, Vuetify, Vuex);
let wrapper = null;

beforeEach(() => {
  wrapper = mount(LogInOrSignUp, {
    localVue,
    // router,
    propsData: { },
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('login or sign up', () => {
  it('should render the header', async () => {
    expect(wrapper.text()).toContain('Log In or Sign Up');
  });
  it('should warn when not giving a email', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is required');
    await wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is required');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should warn when giving an invalid email', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is in an invalid format');
    wrapper.find('[test-email-field]').setValue('invalid.email@!!@you.com');
    await wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is in an invalid format');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should warn when not giving a password', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password is required');
    await wrapper.find('.v-btn[test-login-button]').trigger('click');
    expect(wrapper.text()).toContain('Password is required');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
});
describe('Signing Up As A New User', () => {
  it('should warn when not giving a email', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is required');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is required');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should warn when giving an invalid email', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Email is in an invalid format');
    wrapper.find('[test-email-field]').setValue('invalid.email@!!@you.com');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Email is in an invalid format');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should warn when not giving a password', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password is required');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Password is required');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should warn when password is invalid', async () => {
    await wrapper.find('[test-open-dialog]').trigger('click');
    expect(wrapper.text()).not.toContain('Password must be at least 8 characters.');
    await wrapper.find('input[test-password-field]').setValue('567');
    expect(wrapper.text()).toContain('3');
    await wrapper.find('.v-btn[test-signup-button]').trigger('click');
    expect(wrapper.text()).toContain('Password must be at least 8 characters');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should submit form when email and password is valid', async () => {
    const actions = {
      signupUser: jest.fn(),
      loginUser: jest.fn(),
    };
    const localStore = new Vuex.Store({
      actions,
    });
     wrapper = mount(LogInOrSignUp, {
      localVue,
      router,
      store: localStore,
      propsData: { },
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
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
});
