import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Lists from '@/views/Lists.vue';
import List from '@/views/List.vue';
import DrawerMenu from '@/components/Menus/DrawerMenu.vue';
import EditInfo from '@/components/EditInfo.vue';
import App from '@/App.vue';
import router from '@/router';

jest.setTimeout(8000);
jest.mock('../../src/firebase.js', () => ({
  auth: { currentUser: { emailVerified: true } },
  getListBySlug: jest.fn(() => ({ docs: [] })),
}));
jest.mock('../../src/algolia.js');

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
    actions: {
      fetchLists: jest.fn(),
      fetchList: jest.fn(),
      getRecentlyUsedQuests: jest.fn(),
    },
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

/**
 * NOTE: There is an issue here where the last test (List routing) is causing the
 *  following tests to fail. I suspect there is an async method somewhere that is
 *  not being resolved, probably in a support lib like firebase.js.
 */

describe('Router', () => {
  it('render Lists component via routing', () => {
    expect(wrapper.findComponent(DrawerMenu).exists()).toBe(true);
    expect(wrapper.findComponent(Lists).exists()).toBe(true);
  });
  it('renders the profile component via routing', async () => {
    await wrapper.vm.$router.push('/editinfo');
    expect(wrapper.findComponent(EditInfo).exists()).toBe(true);
  });
  it('renders the about page via routing', async () => {
    expect(wrapper.text()).not.toContain('Grab the Source or Contribute on Github');
    await wrapper.vm.$router.push('/about');
    expect(wrapper.text()).toContain('Grab the Source or Contribute on Github');
  });
  it('renders the terms of service page via routing', async () => {
    expect(wrapper.text()).not.toContain('QuestLists Terms and Conditions');
    await wrapper.vm.$router.push('/about/terms-of-service');
    expect(wrapper.text()).toContain('QuestLists Terms and Conditions');
  });
  it('renders the privacy policy page via routing', async () => {
    await wrapper.vm.$router.push('/about/privacy-policy');
    expect(wrapper.findComponent('.privacy-policy').exists()).toBe(true);
    expect(wrapper.text()).toContain('QuestLists Privacy Policy');
  });
  it('renders the code of conduct page via routing', async () => {
    await wrapper.vm.$router.push('/about/code-of-conduct');
    expect(wrapper.findComponent('.code-of-conduct').exists()).toBe(true);
    expect(wrapper.text()).toContain('QuestLists Code of Conduct');
  });
  it('renders a single List component via routing', async () => {
    await wrapper.vm.$router.push('/lists/abc123');
    expect(wrapper.findComponent(List).exists()).toBe(true);
  });
  it.todo('should not allow anonymous users to visit the edit user page.');
});
