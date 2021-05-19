import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import App from '@/App.vue';
import VueRouter from 'vue-router';
import routes from '@/router/routes';

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(Vuetify);

let wrapper;

beforeEach(() => {
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
    actions: { fetchLists: jest.fn() },
  });
  wrapper = mount(App, {
    localVue,
    router,
    vuetify,
    store: localStore,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('smoother ux transition', () => {
  it('has a transition component', () => {
    const wrapper1 = shallowMount(App, {
      localVue,
      router,
      vuetify,
    });
    expect(wrapper1.find('transition-stub[name="router-anim"]').exists()).toBe(true);
  });

  describe('transitioning between lists view and edit info page (should be less than 0.3 seconds)', () => {
    it.todo('(find out how to test transitions) lists view should have the proper classes when leaving');
    it.todo('(find out how to test transitions) profile view should have the proper classes when entering');
  });
});
