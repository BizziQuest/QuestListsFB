import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import DrawerMenu from '@/components/Menus/DrawerMenu.vue';
import routes from '@/router/routes';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

const recentQuests = [
  {
    title: 'My Favorite Quest',
    icon: 'mdi-flower',
    id: '123abc',
  },
];

jest.mock('firebase.js', () => ({
  auth: {
    currentUser: {
      uid: 'alskdaslkd',
    },
  },
  globalPreferences: {
    onSnapshot: jest.fn(),
  },
  reactToPrefsChange: jest.fn(),
  ensureSlugUniqueness: jest.fn(),
  getRecentlyUsedLists: jest.fn([
    {
      name: 'Test List!',
    },
  ]),
}));

toHaveBeenWarnedInit();


const localVue = createLocalVue();
localVue.use(Vuex);
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);


let wrapper;

beforeEach(async () => {
  const localStore = new Vuex.Store({
    state: {
      recentQuests,
      currentUser: {},
    },
    actions: {
      getRecentlyUsedQuests: jest.fn(),
    },
  });
    wrapper = mount(DrawerMenu, {
    localVue,
    router,
    vuetify,
    store: localStore,
  });
  await wrapper.vm.$nextTick();
});

afterEach(() => {
  wrapper.destroy();
});

describe('Drawer Menu', () => {
  it('component include the user menu item', () => {
    expect(wrapper.find('.user-menu-item').text()).toBe('Sign In or Sign Up');
  });
  it('component include questlists link to homepage', () => {
    expect(wrapper.find('[test-questlists-link]').text()).toBe('QuestLists');
  });
  it('component include link to add new list', () => {
    expect(wrapper.find('[test-default-create-list-item]').text()).toBe('New Quest');
  });
  it('component include favorites list', () => {
    expect(wrapper.find('[test-fav-header]').text()).toBe('Recent Quests');
    expect(wrapper.findAll('[test-fav-link]').length).toBe(1);
    expect(wrapper.findAll('[test-fav-link]').at(0).text()).toBe('My Favorite Quest');
  });
});