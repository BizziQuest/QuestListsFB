import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import List from '@/views/List.vue';
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

describe('List.vue', () => {
  describe('when given an empty list', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', slug: 'list123', data: () => ({ title: 'list123' }) }];
      getListBySlug.mockResolvedValueOnce({ docs: lists });
      wrapper = mount(List, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
      await flushPromises(); // for fetchList() call in List.mounted()
    });
    it('should show a new item input', async () => {
      expect.assertions(1);
      expect(wrapper.vm.listItems).toEqual([]);
    });
    it('should show the correct title', () => {
      // expect(getListBySlug).toHaveReturnedTimes(1);
      // expect(getListBySlug).toHaveBeenCalled();
      expect(wrapper.text()).toContain('list123');
    });
    it('should have the correct id in the $vm', () => {
      expect(wrapper.vm.list.id).toBe('1');
    });
    it('should have the correct title of the list in the $vm', () => {
      expect(wrapper.vm.list.title).toBe('list123');
    });
    it('should have the correct listItems in the $vm', () => {
      expect(wrapper.vm.listItems.length).toBe(0);
    });
    it('should have the correct possible list item states in the $vm', () => {
      expect(wrapper.vm.states).toStrictEqual([]);
    });
  });

  describe('when given a list with single item', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', data: () => ({ title: 'list123' }) }];
      getListBySlug.mockResolvedValueOnce({ docs: lists });
      const listItems = [{ title: 'Test Item' }];
      getListItems.mockResolvedValueOnce(listItems);
      wrapper = mount(List, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
      expect(getListBySlug).toHaveBeenCalled();
      await flushPromises(); // for fetchList() call in List.mounted()
    });
    it('should show the list item and a new item input', () => {
      const listItemInputs = wrapper.findAll('.list-item-view');
      expect(listItemInputs.length).toEqual(2);
      expect(listItemInputs.wrappers[0].vm.title).toEqual('Test Item');
    });
    it('should show the correct title', () => {
      expect(wrapper.text()).toContain('list123');
    });
    it('should have the correct id in the $vm', () => {
      expect(wrapper.vm.list.id).toBe('1');
    });
    it('should have the correct title of the list in the $vm', () => {
      expect(wrapper.vm.list.title).toBe('list123');
    });
    it('should have the correct listItems in the $vm', () => {
      expect(wrapper.vm.listItems).toEqual([{ title: 'Test Item' }]);
    });
    it('should have the correct possible list item states in the $vm', () => {
      expect(wrapper.vm.states).toStrictEqual([]);
    });
    it('should have the correct possible list item states in the $vm', () => {
      expect(wrapper.vm.states).toStrictEqual([]);
    });
  });

  describe('when an items delete icon is clicked ', () => {
    let wrapper;
    beforeEach(async () => {
      const lists = [{ id: '1', data: () => ({ title: 'list123' }) }];
      getListBySlug.mockResolvedValueOnce({ docs: lists });
      const listItems = [{ title: 'Test Item' }, { title: 'Test Item 2' }];
      getListItems.mockResolvedValueOnce(listItems);
      saveListItems.mockResolvedValueOnce([]);
      wrapper = mount(List, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
      });
      await flushPromises(); // for fetchList() call in List.mounted()
    });
    it('should remove the item', async () => {
      expect(wrapper.vm.listItems.length).toBe(2);
      expect(wrapper.vm.listItems[0].title).toBe('Test Item');
      expect(wrapper.vm.listItems[0].isNewItem).toBeFalsy();
      const itemInput = wrapper.find('.list-item-view');
      await itemInput.find('.v-btn[title="delete"]').trigger('click');
      await wrapper.vm.$nextTick();
      expect(saveListItems).toHaveBeenCalled();
      expect(wrapper.vm.listItems.length).toBe(1);
      expect(wrapper.vm.listItems[0].title).toBe('Test Item 2');
      expect(wrapper.vm.listItems[0].isNewItem).toBe(undefined);
    });
    it('should save the new list', async () => {
      const itemInput = wrapper.find('.list-item-view');
      await itemInput.find('.v-btn[title="delete"]').trigger('click');
      await wrapper.vm.$nextTick();
      expect(saveListItems).toBeCalledWith('1', [{ title: 'Test Item 2' }]);
    });
  });
});
