jest.mock('../../src/firebase.js');

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import List from '@/views/List.vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises'
import { getListBySlug, getListItems, getListStates } from '../../src/firebase.js';

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

describe('list item default state', () => {
  let wrapper;
  beforeEach(async () => {
    const lists = [{ id: "1", data: () => ({ title: 'list123' }) }]
    getListBySlug.mockResolvedValueOnce(lists);
    wrapper = mount(List, {
      localVue,
      vuetify,
      store: localStore,
      mocks: {
        $route,
      }
    });
    expect(getListBySlug).toHaveBeenCalled();
    await flushPromises();  // for fetchList() call in List.mounted()
  });
  describe('when given a list', () => {
    it('should show a new item input', () => {
      expect(wrapper.vm.listItems).toEqual([{ isNewItem: true, title: '' }]);
    });
    it('should show the correct title', () => {
      expect(wrapper.text()).toContain('list123');
    });
    it('should have the correct id in the $vm', () => {
      expect(wrapper.vm.list['id']).toBe('1');
    });
    it('should have the correct title of the list in the $vm', () => {
      expect(wrapper.vm.list.title).toBe('list123');
    });
    it('should have the correct listItems in the $vm', () => {
      expect(wrapper.vm.listItems).toEqual([{ isNewItem: true, title: '' }]);
    });
    it('should have the correct possible list item states in the $vm', () => {
      expect(wrapper.vm.states).toStrictEqual([]);
    });
  });
});

describe('list with single item', () => {
  let wrapper;
  beforeEach(async () => {
    const lists = [{ id: "1", data: () => ({ title: 'list123' }) }]
    getListBySlug.mockResolvedValueOnce(lists);
    const listItems = [{ title: 'Test Item' }]
    getListItems.mockResolvedValueOnce(listItems);
    wrapper = mount(List, {
      localVue,
      vuetify,
      store: localStore,
      mocks: {
        $route,
      }
    });
    expect(getListBySlug).toHaveBeenCalled();
    await flushPromises();  // for fetchList() call in List.mounted()
  });
  describe('when given a list', () => {
    it('should show the list item and a new item input', () => {
      const listItemInputs = wrapper.findAll('.list-item-view');
      expect(listItemInputs.length).toEqual(2);
      expect(listItemInputs.wrappers[0].text()).toContain('Test Item');
    });
    it('should show the correct title', () => {
      expect(wrapper.text()).toContain('list123');
    });
    it('should have the correct id in the $vm', () => {
      expect(wrapper.vm.list['id']).toBe('1');
    });
    it('should have the correct title of the list in the $vm', () => {
      expect(wrapper.vm.list.title).toBe('list123');
    });
    it('should have the correct listItems in the $vm', () => {
      expect(wrapper.vm.listItems).toEqual([{title: 'Test Item'}, { isNewItem: true, title: '' }]);
    });
    it('should have the correct possible list item states in the $vm', () => {
      expect(wrapper.vm.states).toStrictEqual([]);
    });
  });
});


describe('list item deletion', () => {
  test('when delete icon is clicked item is removed', async () => {
    expect(getListBySlug).toHaveBeenCalled();
    await flushPromises();  // for fetchList() call in List.mounted()
    expect(wrapper.vm.list['id']).toBe('1');
    expect(wrapper.vm.list.title).toBe('list123');
    expect(wrapper.vm.listItems).toEqual([{ isNewItem: true, title: '' }]);
    expect(wrapper.vm.states).toStrictEqual([]);
    expect(wrapper.text()).toContain('list123');
  })
})