import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import md5 from 'md5';
import routes from '@/router/routes';
import EditInfo from '@/components/EditInfo.vue';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

jest.mock('../../src/firebase.js');

toHaveBeenWarnedInit();

const localVue = createLocalVue();
localVue.use(Vuex);
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper;

describe('default state with unverified username/password user', () => {
  beforeEach(() => {
    const localStore = new Vuex.Store({
      state: {
        currentUser: {
          avatar: '/img/unknown_user.svg', // when we set the user in the store, we default to this.
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
    expect(wrapper.vm.avatar).toBe('/img/unknown_user.svg');
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
  const actions = {
    saveProfile: jest.fn(),
  };
  beforeEach(() => {
    const localStore = new Vuex.Store({
      actions,
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
    it('set to true, sets the avatar to the gravatar', async () => {
      await wrapper.find('[test-useGravatar-checkbox]').trigger('click');
      expect(wrapper.vm.useGravatar).toBe(true);
      const avatarImage = wrapper.find('.v-image[test-avatar-image]');
      const gravatarLink = `https://www.gravatar.com/avatar/${md5('tersterson3@test.com')}?d=robohash`;
      expect(avatarImage.vm.src).toBe(gravatarLink);
      expect(wrapper.vm.avatarPreview).toBe(gravatarLink);
    });
    it('set to false, uses the last set avatar', async () => {
      expect(wrapper.vm.useGravatar).toBe(false);
      await wrapper.find('[test-avatar-input]').setValue('newAvatar.jpg');
      let avatarImage = wrapper.find('.v-image[test-avatar-image]');
      expect(avatarImage.vm.src).toBe('newAvatar.jpg');
      expect(wrapper.vm.avatarPreview).toBe('newAvatar.jpg');

      await wrapper.find('[test-useGravatar-checkbox]').trigger('click');
      expect(wrapper.vm.useGravatar).toBe(true);
      avatarImage = wrapper.find('.v-image[test-avatar-image]');
      const gravatarLink = `https://www.gravatar.com/avatar/${md5('tersterson3@test.com')}?d=robohash`;
      expect(avatarImage.vm.src).toBe(gravatarLink);
      expect(wrapper.vm.avatarPreview).toBe(gravatarLink);

      await wrapper.find('[test-useGravatar-checkbox]').trigger('click');
      expect(wrapper.vm.useGravatar).toBe(false);
      avatarImage = wrapper.find('.v-image[test-avatar-image]');
      expect(avatarImage.vm.src).toBe('newAvatar.jpg');
      expect(wrapper.vm.avatarPreview).toBe('newAvatar.jpg');
    });

    it('set to false, and user has no last avatar, uses the default avatar', async () => {
      await wrapper.find('[test-useGravatar-checkbox]').trigger('click');
      expect(wrapper.vm.useGravatar).toBe(true);
      let avatarImage = wrapper.find('.v-image[test-avatar-image]');
      const gravatarLink = `https://www.gravatar.com/avatar/${md5('tersterson3@test.com')}?d=robohash`;
      expect(avatarImage.vm.src).toBe(gravatarLink);
      expect(wrapper.vm.avatarPreview).toBe(gravatarLink);

      await wrapper.find('[test-useGravatar-checkbox]').trigger('click');
      expect(wrapper.vm.useGravatar).toBe(false);
      avatarImage = wrapper.find('.v-image[test-avatar-image]');
      expect(avatarImage.vm.src).toBe('/path/to/image.jpg');
      expect(wrapper.vm.avatarPreview).toBe('/path/to/image.jpg');
    });
    it('saves profile to store', async () => {
      await wrapper.find('[test-useGravatar-checkbox]').trigger('click');
      expect(wrapper.vm.useGravatar).toBe(true);
      const avatarImage = wrapper.find('.v-image[test-avatar-image]');
      const gravatarLink = `https://www.gravatar.com/avatar/${md5('tersterson3@test.com')}?d=robohash`;
      expect(avatarImage.vm.src).toBe(gravatarLink);
      expect(wrapper.vm.avatarPreview).toBe(gravatarLink);

      await wrapper.find('[test-save-button]').trigger('click');
      expect(actions.saveProfile.mock.calls[0][1].avatar).toBe('/path/to/image.jpg');
      expect(actions.saveProfile.mock.calls[0][1].useGravatar).toBe(true);
    });
    it.todo('cancel button revert profile to last change');
  });
});
