import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Lists from '@/views/Lists.vue';
import List from '@/views/List.vue';
import DrawerMenu from '@/components/Menus/DrawerMenu.vue';
import EditInfo from '@/components/EditInfo.vue';
import App from '@/App.vue';
import Vuetify from 'vuetify';
import router from '@/router';
import About from '@/views/About.vue';
// import Terms from '@/views/Terms.vue';
// import Privacy from '@/views/Privacy.vue';
// import Conduct from '@/views/Conduct.vue';

jest.mock('../../src/firebase.js');

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(VueRouter);
localVue.use(Vuex);
localVue.use(Vuetify);

let wrapper = null;

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

describe('Router', () => {
  it('render Lists component via routing', async () => {
    expect(wrapper.findComponent(DrawerMenu).exists()).toBe(true);
    expect(wrapper.findComponent(Lists).exists()).toBe(true);
  });
  it('renders a single List component via routing', async () => {
    // since we are testing for the presence of a component, we only need to check if that component renders
    await wrapper.vm.$router.push('/lists/abc123');
    expect(wrapper.findComponent(List).exists()).toBe(true);
  });
  it('renders the profile component via routing', async () => {
    expect(wrapper.findComponent(EditInfo).exists()).not.toBe(true);
    await wrapper.vm.$router.push('/editinfo');
    expect(wrapper.findComponent(EditInfo).exists()).toBe(true);
  });
  // it('renders the about page via routing', async () => {
  //   await wrapper.vm.$router.push('/about');
  //   expect(wrapper.findComponent(About).exists()).toBe(true);
  //   expect(wrapper.text()).toContain('About QuestLists');
  // });
  // it('renders the terms of service page via routing', async () => {
  //   expect(wrapper.text()).not.toContain('QuestLists Terms and Conditions');
  //   await wrapper.vm.$router.push('/about/terms');
  //   expect(wrapper.findComponent(Terms).exists()).toBe(true);
  //   expect(wrapper.text()).toContain('QuestLists Terms and Conditions');
  // });
  // it('renders the privacy policy page via routing', async () => {
  //   await wrapper.vm.$router.push('/about/privacy');
  //   expect(wrapper.findComponent(Privacy).exists()).toBe(true);
  //   expect(wrapper.text()).toContain('QuestLists Privacy Policy');
  // });
  // it('renders the code of conduct page via routing', async () => {
  //   await wrapper.vm.$router.push('/about/conduct');
  //   expect(wrapper.findComponent(Conduct).exists()).toBe(true);
  //   expect(wrapper.text()).toContain('QuestLists Code of Conduct');
  // });
  it.todo('should not allow anonymous users to visit the edit user page.');
});
