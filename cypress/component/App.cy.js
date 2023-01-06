import Vuex from 'vuex';
import { mountCallback } from 'cypress/vue';
import App from '../../src/App.vue';
import router from '../../src/router';


describe('App.vue component', () => {
  beforeEach(() => {
    // const fakeBodyElement = document.createElement('div');
    // if (document.body) {
    //   document.body.appendChild(fakeBodyElement);
    // }
    const state = {
      messages: [],
      currentUser: {
        avatar: '/img/unknown_user.svg', // when we set the user in the store, we default to this.
        displayName: null,
        email: 'tersterson3@test.com',
        emailVerified: false,
        uid: 'UUID123456',
        useGravatar: false,
      },
      globalPreferences: {},
    };
    // const localStore = new Vuex.Store({
    //   getters: { getGlobalPreferences: (s) => s.globalPreferences },
    //   state,
    //   actions: { fetchLists: () => {}, getRecentlyUsedQuests: () => {} },
    // });
    mountCallback(App, {
      // localVue,
      // vuetify,
      // extensions: {
      //   use: [router, Vuex],
        // store: localStore,
      // },
      // propsData: {},
    });
    cy.intercept('*algolia*', {
      body: {
        response: "yay"
      }
    })
  });

  it.only('renders a single v-app element', () => {
    cy.get('#app').should('be.visible');
  });
  it('renders the left menu drawer', () => {
    expect(wrapper.findAll('drawer-menu-stub').length).toBe(1);
  });
  it('renders the bottom drawer menu bar', () => {
    expect(wrapper.findAll('bottom-drawer-menu-stub').length).toBe(1);
  });
  it('renders the router view', () => {
    expect(wrapper.findAll('router-view-stub').length).toBe(1);
  });
});

describe('App.vue response to service worker update', () => {
  beforeEach(() => {
    const fakeBodyElement = document.createElement('div');
    if (document.body) {
      document.body.appendChild(fakeBodyElement);
    }
    const state = {
      messages: [],
      currentUser: {
        avatar: '/img/unknown_user.svg', // when we set the user in the store, we default to this.
        displayName: null,
        email: 'tersterson3@test.com',
        emailVerified: false,
        uid: 'UUID123456',
        useGravatar: false,
      },
      globalPreferences: {},
    };
    const localStore = new Vuex.Store({
      getters: { getGlobalPreferences: (s) => s.globalPreferences },
      state,
      actions: { fetchLists: jest.fn(), getRecentlyUsedQuests: jest.fn(), },
    });
    wrapper = mount(App, {
      localVue,
      vuetify,
      router,
      store: localStore,
      propsData: {},
      attachTo: fakeBodyElement,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('shows a notification when the app has been updated', async () => {
    expect(wrapper.find('[test-update-notification]').vm.value).toBe(false);
    await wrapper.trigger('swUpdated', { detail: 'Finished Loading' });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.updateExists).toBe(true);
    expect(wrapper.find('[test-update-notification]').vm.value).toBe(true);
    expect(wrapper.vm.registration).toBe('Finished Loading');
  });
});
