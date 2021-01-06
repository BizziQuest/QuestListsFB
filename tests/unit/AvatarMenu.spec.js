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

describe('default state', () => {
  it('should render the correct text', async () => {
    const wrapper = shallowMount(AvatarMenu, {
      localVue,
      router,
      vuetify,
      store,
    });
    expect(wrapper.text()).toContain('Profile Actions');
    expect(wrapper.text()).toContain('Edit Profile');
  });
  it('should render the correct default avatar', async () => {
    const wrapper = mount(AvatarMenu, {
      localVue,
      router,
      vuetify,
      store,
    });
    expect(wrapper.findComponent({ name: 'VImg' }).vm.src).toBe('/img/unknown_user.svg');
  });
});

describe('avatar changes', () => {
  it('should render the state-updated default avatar', async () => {
    const wrapper = mount(AvatarMenu, {
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
    expect(wrapper.findComponent({ name: 'VImg' }).vm.src).toBe('someAvatar.png');
  });
});

describe('the user menu', () => {
  it("should show when clicking on the user's avatar", async (done) => {
    const App = localVue.component('App', {
      components: { AvatarMenu },
      template: `
        <v-app data-app>
          <AvatarMenu />
        </v-app>
      `,
    });
    const mountedApp = mount(App, {
      localVue,
      router,
      vuetify,
      store,
    });
    // const wrapper = mountedApp.findComponent(AvatarMenu);
    const avatar = mountedApp.findComponent({ name: 'VAvatar' });
    let theMenu = mountedApp.findComponent({ name: 'VList' });
    expect(theMenu.exists()).toBe(false);

    await avatar.trigger('click');

    let AllTheTooltip = mountedApp.findAllComponents({ name: 'VTooltip' });
    const AllTheButtons = mountedApp.findAllComponents({ name: 'VBtn' });
    theMenu = mountedApp.findComponent({ name: 'VList' });

    expect(theMenu.exists()).toBe(true);
    expect(theMenu.html()).toContain('Profile Actions');
    expect(theMenu.html()).toContain('Profile');
    expect(theMenu.html()).not.toContain('Edit Profile');

    expect(AllTheButtons.length).toBe(3);

    await AllTheButtons.wrappers[1].trigger('mouseenter');
    await requestAnimationFrame(() => {
      AllTheTooltip = mountedApp.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.length).toBe(2);
      expect(AllTheTooltip.wrappers[0].html()).toContain('Edit Profile');
      done();
    });
  });
});

describe('the menu tooltips', () => {
  it('should show the correct tooltip when hovering over the profile icon', async (done) => {
    const App = localVue.component('App', {
      components: { AvatarMenu },
      template: `
        <v-app data-app>
          <AvatarMenu />
        </v-app>
      `,
    });
    const mountedApp = mount(App, {
      localVue,
      router,
      vuetify,
      store,
    });

    const avatar = mountedApp.findComponent({ name: 'VAvatar' });
    await avatar.trigger('click');
    let AllTheTooltip = mountedApp.findAllComponents({ name: 'VTooltip' });
    const AllTheButtons = mountedApp.findAllComponents({ name: 'VBtn' });
    await AllTheButtons.wrappers[1].trigger('mouseenter');
    requestAnimationFrame(() => {
      AllTheTooltip = mountedApp.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.wrappers[0].html()).toContain('Edit Profile');
      done();
    });
  });
  it('should show the correct tooltip when hovering over the logout icon', async (done) => {
    const App = localVue.component('App', {
      components: { AvatarMenu },
      template: `
        <v-app data-app>
          <AvatarMenu />
        </v-app>
      `,
    });
    const mountedApp = mount(App, {
      localVue,
      router,
      vuetify,
      store,
    });

    const avatar = mountedApp.findComponent({ name: 'VAvatar' });
    await avatar.trigger('click');
    let AllTheTooltip = mountedApp.findAllComponents({ name: 'VTooltip' });
    const AllTheButtons = mountedApp.findAllComponents({ name: 'VBtn' });
    await AllTheButtons.wrappers[2].trigger('mouseenter');
    requestAnimationFrame(() => {
      AllTheTooltip = mountedApp.findAllComponents({ name: 'VTooltip' });
      expect(AllTheTooltip.wrappers[1].text()).toBe('Log Out');
      done();
    });
  });
});
