import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import Lists from '@/views/Lists.vue';
import { saveListItems, fetchQuestLists, getListItems } from '../../src/firebase';

jest.mock('../../src/firebase.js');
jest.mock('../../src/algolia.js');

const localVue = createLocalVue();
const vuetify = new Vuetify();
const $route = { params: { slug: 'list123' } };

localVue.use(Vuex);

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
    lists: [],
  },
});

describe('Lists.vue', () => {
  describe('when there are no lists', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
      await flushPromises()
    });
    it('should show an alert saying there are no lists', () => {
      expect(wrapper.html()).toContain('Welcome to Quest Lists!')
    });
  });

  describe('when there is a list', () => {
    let wrapper, lists;
    beforeEach(async () => {
      lists = [{ id: '1',  title: 'list123'  }];
      localStore.state.lists = lists;
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
      await flushPromises(); // for fetchList() call in List.mounted()
    });
    it('should show the list card', () => {
      expect(wrapper.findAll(".list-card").wrappers.length).toBe(1)
    });
    it('should not show the no lists warning', () => {
      expect(wrapper.html()).not.toContain('Welcome to Quest Lists!')
    });
    it('should show the name of the list', () => {
      expect(wrapper.findAll(".list-card").wrappers[0].text()).toContain(lists[0].title)
    });
  });

  describe('when searching for an item', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', data: () => ({ title: 'list123' }) }];
      getListBySlug.mockResolvedValueOnce({ docs: lists });
      const listItems = [{ title: 'Test Item' }, { title: 'Test Item 2' }];
      getListItems.mockResolvedValueOnce(listItems);
      saveListItems.mockResolvedValueOnce([]);
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
      await flushPromises(); // for fetchList() call in List.mounted()
    });
    describe('when there are no matches', async () => {
      it('should show the current list of items', async () => {
      });
    });
    describe('when there are matches', async () => {
      it('should show the current list of matched list cards', async () => {
      });
    });
  });
});
