import EditInfo from '@/components/EditInfo.vue';
import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
// import Vue from 'vue';
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

let wrapper;

describe('default state with unverified username/password user', () => {
  beforeEach(() => {
    const localStore = new Vuex.Store({
      state: {
        currentUser: {
          avatar: null,
          displayName: null,
          email: 'tersterson3@test.com',
          emailVerified: false,
          uid: 'UUID123456',
          useGravatar: false,
        },
      },
    });
    wrapper = mount(EditInfo, {
      localVue,
      router,
      vuetify,
      store: localStore,
    });
  });

  it('should render "the unknown user avatar"', () => {
    const avatarImage = wrapper.find('.v-image[test-avatar-image]');
    expect(avatarImage.vm.src).toBe('/img/unknown_user.svg');
  });
  it('should have the correct user values', () => {
    expect(wrapper.vm.userId).toBe('UUID123456');
    expect(wrapper.vm.displayName).toBe(null);
    expect(wrapper.vm.email).toBe('tersterson3@test.com');
    expect(wrapper.vm.avatar).toBe(null);
    expect(wrapper.vm.useGravatar).toBe(false);
  });
});
describe('default state with unverified 0Auth user', () => {
  beforeEach(() => {
    const localStore = new Vuex.Store({
      state: {
        currentUser: {
          avatar: '/path/to/image.jpg',
          displayName: '0Auth Dispaly Name',
          email: 'tersterson3@test.com',
          emailVerified: false,
          uid: 'UUID123456',
          useGravatar: false,
        },
      },
    });
    wrapper = mount(EditInfo, {
      localVue,
      router,
      vuetify,
      store: localStore,
    });
  });
  it('should render "the user\'s 0Auth avatar"', () => {
    const avatarImage = wrapper.find('.v-image[test-avatar-image]');
    expect(avatarImage.vm.src).toBe('/path/to/image.jpg');
  });
  it('should have the correct user values', () => {
    expect(wrapper.vm.userId).toBe('UUID123456');
    expect(wrapper.vm.displayName).toBe('0Auth Dispaly Name');
    expect(wrapper.vm.email).toBe('tersterson3@test.com');
    expect(wrapper.vm.avatar).toBe('/path/to/image.jpg');
    expect(wrapper.vm.useGravatar).toBe(false);
  });
});

describe('saving a user', () => {
  beforeEach(() => {
    const localStore = new Vuex.Store({
      state: {
        currentUser: {
          avatar: '/path/to/image.jpg',
          displayName: '0Auth Dispaly Name',
          email: 'tersterson3@test.com',
          emailVerified: false,
          uid: 'UUID123456',
          useGravatar: false,
        },
      },
    });
    wrapper = mount(EditInfo, {
      localVue,
      router,
      vuetify,
      store: localStore,
    });
  });
  describe('setting the gravatar', () => {
    it.todo('set to true, sets the avatar to the gravatar');
    it.todo('updated the preview accordingly');
    it.todo('set to false, uses the last set avatar');
    it.todo('set to false, and user has no last avatar, uses the default avatar');
    it.todo('stores gravatar to firestore');
  });
});
