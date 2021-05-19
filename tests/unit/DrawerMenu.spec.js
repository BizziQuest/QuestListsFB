import DrawerMenu from '@/components/Menus/DrawerMenu.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import Vuetify from 'vuetify';
import store from '@/store';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper;

beforeEach(() => {
  wrapper = mount(DrawerMenu, {
    localVue,
    router,
    vuetify,
    store,
  });
  wrapper.vm.favoriteQuests = [{
    name: 'My Favorite Quest',
    icon: 'mdi-flower',
    id: '123abc',
  }];
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
    expect(wrapper.find('[test-default-create-list-item]').text()).toBe('add New Quest');
  });
  it('component include search button', () => {
    expect(wrapper.find('[test-search-link]').text()).toBe('Search');
  });
  it('component include favorites list', () => {
    expect(wrapper.find('[test-fav-header]').text()).toBe('Favorite Quests');
    expect(wrapper.findAll('[test-fav-link]').length).toBe(1);
    expect(wrapper.findAll('[test-fav-link]').at(0).text()).toBe('My Favorite Quest');
  });
});
