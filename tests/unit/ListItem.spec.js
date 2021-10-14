import ListItem from '@/components/ListItem.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';
import { globalPreferences, stateGroupsCollection, createList } from '../../src/firebase';

jest.mock('../../src/firebase.js');

const localVue = createLocalVue();
const vuetify = new Vuetify();

localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/listitems/:id', name: 'listItems', component: ListItem,
    },
  ],
});

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
  getters: {
    getGlobalPreferences: () => ({
      defaultStateGroup: {},
    }),
  },
});

toHaveBeenWarnedInit();

// let wrapper = null;

describe('default state', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ListItem, {
      localVue,
      vuetify,
      store: localStore,
      router,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should not show make sub list icon on empty text filed', async () => {
    expect(wrapper.find('[test-make-sublist]').exists()).toBe(false);
  });
  it('should make sublist on filled text filed', async () => {
    globalPreferences.mockResolvedValueOnce({ defaultStateGroup: {} });
    stateGroupsCollection.doc.mockResolvedValueOnce({});
    createList.mockResolvedValueOnce({
      slug: 'abc123',
      get: jest.fn(() => Promise.resolve({
        data: jest.fn(() => ({
          slug: 'abc123',
        })),
      })),
    });
    const sublistSpy = jest.spyOn(wrapper.vm, 'makeSublist');
    const textInput = wrapper.find('input[type="text"]');
    await textInput.setValue('some value');
    await wrapper.find('[test-make-sublist]').trigger('click');
    await wrapper.vm.$forceUpdate();
    expect(sublistSpy).toHaveBeenCalled();
  });
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
