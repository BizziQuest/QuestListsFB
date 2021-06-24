import { mount, createLocalVue } from '@vue/test-utils';
import ListItem from '@/components/ListItem.vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

const localVue = createLocalVue();
const vuetify = new Vuetify();

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

describe('ListItem.vue', () => {
  describe('without a value given', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(ListItem, {
        localVue,
        vuetify,
        store: localStore,
      });
    });
    it('should set the title to undefined', () => {
      expect(wrapper.vm.title).toBe(undefined);
    });
    it('should set isNewItem to undefined', () => {
      expect(wrapper.vm.isNewItem).toBe(undefined);
    });
    it('should set the listId to undefined', () => {
      expect(wrapper.vm.listId).toBe(undefined);
    });
    it('should not change the sublist property', () => {
      expect(wrapper.vm.subList).toBe(null);
    });
  });
  describe('when given a value object', () => {
    let wrapper;
    let item;
    beforeEach(() => {
      item = {
        title: 'Test Item',
        isNewItem: false,
        listId: 'test-list',
      };
      wrapper = mount(ListItem, {
        localVue,
        vuetify,
        store: localStore,
        propsData: {
          value: item,
        },
      });
    });
    it('should have the correct title', () => {
      expect(wrapper.vm.title).toBe(item.title);
    });
    it('should have the correct isNewItem', () => {
      expect(wrapper.vm.isNewItem).toBe(item.isNewItem);
    });
    it('should have the correct listId', () => {
      expect(wrapper.vm.listId).toBe(item.listId);
    });
    it('should have the correct subList', () => {
      expect(wrapper.vm.subList).toBe(null);
    });
    it('should show the item', async () => {
      expect(wrapper.find('.v-text-field').vm.value).toBe(item.title);
    });
  });
});
