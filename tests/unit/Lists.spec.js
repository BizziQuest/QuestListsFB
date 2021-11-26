import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import Lists from '@/views/List.vue';

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
  actions: {
    fetchLists: () => ([{id: 1},{id: 2}]);
  }
});

describe('Lists.vue', () => {
  describe('when given an empty list', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', data: () => ({ title: 'list123' }) }];
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
    it.todo('should show loader while loading the lists');
    it.todo('should show the add list dialog when there are no lists');

    it.todo('should show the list cards for each list');
  });
});
