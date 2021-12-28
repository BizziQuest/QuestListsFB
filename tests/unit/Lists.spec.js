import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import Lists from '@/views/Lists.vue';
import { saveListItems, getListBySlug, getListItems } from '../../src/firebase';

jest.mock('../../src/firebase.js');

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
  },
});

describe('Lists.vue', () => {
  describe('when there are no lists', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', slug: 'list123', data: () => ({ title: 'list123' }) }];
      getListBySlug.mockResolvedValueOnce({ docs: lists });
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
    });
    it('should show an alert saying there are no lists', async () => {
    });
  });

  describe('when there is a list', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', data: () => ({ title: 'list123' }) }];
      getListBySlug.mockResolvedValueOnce({ docs: lists });
      const listItems = [{ title: 'Test Item' }];
      getListItems.mockResolvedValueOnce(listItems);
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
    });
    it('should not show the no lists warning', () => {
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
