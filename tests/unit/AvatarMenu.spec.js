import AvatarMenu from '@/components/Menus/AvatarMenu.vue';
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
    wrapper = mount(AvatarMenu, {
      localVue,
      router,
      vuetify,
      store,
    });
  });

  it('should render the correct text', async () => {
    expect(wrapper.text()).toBe('');
  });
  it('should render the correct default avatar', async () => {
    expect(wrapper.findComponent({ name: 'VImg' }).vm.src).toBe('/img/unknown_user.svg');
  });
});

describe('avatar changes', () => {
  it('should render the state-updated default avatar', async () => {
    const thisWrapper = mount(AvatarMenu, {
      localVue,
      router,
      vuetify,
      store,
      computed: {
        getUserAvatar() {
          return 'someAvatar.png';
        },
      },
    });
    expect(thisWrapper.findComponent({ name: 'VImg' }).vm.src).toBe('someAvatar.png');
  });
});

describe('the user menu', () => {
  beforeEach(() => {
    app = localVue.component('App', {
      components: { AvatarMenu },
      template: `
        <v-app>
        </v-app>
      `,
    });
    document.body.setAttribute('data-app', 'true');
    wrapper = mount(AvatarMenu, {
      localVue,
      router,
      vuetify,
      store,
      attachTo: 'v-app',
    });
  });
  it("should show when clicking on the user's avatar", async (done) => {
    // const wrapper = mountedApp.findComponent(AvatarMenu);
    // const avatar = wrapper.findComponent({ name: 'VAvatar' });
    document.body.setAttribute('data-app', 'true');
    let theMenu = wrapper.findComponent({ name: 'VList' });
    expect(theMenu.exists()).toBe(false);

    await wrapper.trigger('click');

    let AllTheTooltip = wrapper.findAllComponents({ name: 'VTooltip' });
    const AllTheButtons = wrapper.findAllComponents({ name: 'VBtn' });
    theMenu = wrapper.findComponent({ name: 'VList' });

    expect(theMenu.exists()).toBe(true);
    expect(theMenu.html()).toContain('Profile Actions');
    expect(theMenu.html()).toContain('Profile');
    expect(theMenu.html()).not.toContain('Edit Profile');

    expect(AllTheButtons.length).toBe(3);

    await AllTheButtons.wrappers[1].trigger('mouseenter');
    await requestAnimationFrame(() => {
      AllTheTooltip = wrapper.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.length).toBe(2);
      expect(AllTheTooltip.wrappers[0].html()).toContain('Edit Profile');
      document.body.setAttribute('data-app', 'false');
      done();
    });
  });
  it.todo('should go to the profile edit page when clicking the edit profile button.');
  it('should show the correct tooltip when hovering over the profile icon', async (done) => {
    const avatar = wrapper.findComponent({ name: 'VAvatar' });
    await avatar.trigger('click');
    const AllTheButtons = wrapper.findAllComponents({ name: 'VBtn' });
    await AllTheButtons.wrappers[1].trigger('mouseenter');
    requestAnimationFrame(() => {
      const AllTheTooltip = wrapper.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.wrappers[0].html()).toContain('Edit Profile');
      done();
    });
  });
  it('should mount the logout component', async () => {
    await wrapper.findComponent({ name: 'VAvatar' }).trigger('click');
    const logoutComponent = wrapper.findAllComponents({ name: 'LogOut' });
    expect(logoutComponent.exists()).toBe(true);
  });
});
