import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import ListItem from '@/components/ListItem.vue';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';
import {
  globalPreferences, stateGroupsCollection, createList, computeSubListPath,
} from '../../src/firebase';

jest.mock('../../src/firebase.js');

const localVue = createLocalVue();
const vuetify = new Vuetify();

localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/Lists/:slug+',
      name: 'List',
      component: jest.fn(),
      props: true,
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
  it('should show the delete icon on empty, non-new text filed', async () => {
    expect(wrapper.find('[test-delete-icon]').exists()).toBe(true);
  });
  it('should not show the sublist link icon on empty, non-new text filed', async () => {
    expect(wrapper.find('[test-sublist-link-icon]').exists()).toBe(false);
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
  it('should show the loading icon when sublist is created', async () => {
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
    const textInput = wrapper.find('input[type="text"]');
    await textInput.setValue('some value');
    expect(wrapper.find('[test-make-sublist]').vm.loading).toBe(false);
    await wrapper.find('[test-make-sublist]').trigger('click');
    // await wrapper.vm.$nextTick();
    expect(wrapper.find('[test-make-sublist]').vm.loading).toBe(true); // NOTE: this *may* cause intermittent failures
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

  describe('text is not blank', () => {
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
    it('should show make sub list icon', async () => {
      expect(wrapper.find('[test-make-sublist]').exists()).toBe(true);
    });
    it('should show the delete icon', async () => {
      expect(wrapper.find('[test-delete-icon]').exists()).toBe(true);
    });
    it('should not show the sublist link icon', async () => {
      expect(wrapper.find('[test-sublist-link-icon]').exists()).toBe(false);
    });
    it.todo('goes to next item when enter is pressed. NOTE: not testable in jest');
    // , async () => {
    //   wrapper.find('[test-text-field]').trigger('keydown.enter');
    //   await wrapper.vm.$nextTick();
    //   expect(wrapper.find('input').isFocused).toBe(true);
    // });
    describe('when clicking on create new sublist icon', () => {
      it.todo('emits the update event');
      it.todo('creates a new list');
    });
  });
  describe('text is blank', () => {
    let wrapper;
    let item;
    beforeEach(() => {
      item = {
        title: '',
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
    it('should show make sub list icon', async () => {
      expect(wrapper.find('[test-make-sublist]').exists()).toBe(false);
    });
    it('should show the delete icon', async () => {
      expect(wrapper.find('[test-delete-icon]').exists()).toBe(true);
    });
    it('should not show the sublist link icon', async () => {
      expect(wrapper.find('[test-sublist-link-icon]').exists()).toBe(false);
    });
  });
  describe('item has sublist', () => {
    let wrapper;
    let item;

    beforeEach(() => {
      computeSubListPath.mockResolvedValueOnce('list/asdkjfgdjklfhagsdjfhg');
      item = {
        title: 'Test Item',
        isNewItem: false,
        listId: 'test-list',
        subList: 'list/asdkjfgdjklfhagsdjfhg',
      };
      wrapper = mount(ListItem, {
        localVue,
        vuetify,
        router,
        store: localStore,
        propsData: {
          value: item,
        },
      });
    });
    it('should not show make sub list icon', async () => {
      expect(wrapper.find('[test-make-sublist]').exists()).toBe(false);
    });
    it('should show the delete icon', async () => {
      expect(wrapper.find('[test-delete-icon]').exists()).toBe(true);
    });
    it('should show the sublist link icon', async () => {
      expect(wrapper.find('[test-sublist-link-icon]').exists()).toBe(true);
    });
    describe('when clicking on go to sublist icon', () => {
      it('emits the update event', async () => {
        await wrapper.find('[test-sublist-link-icon]').trigger('click');
        expect(wrapper.emitted().update[0]).toEqual([{
          title: item.title,
          isNewItem: false,
          listId: item.listId,
          subList: item.subList,
          state: undefined,
        }]);
      });
      it.todo('navigates to the sublist. TODO: figure out how to check for route change');
      // , async () => {
      //   await wrapper.find('[test-sublist-link-icon]').trigger('click');
      //   await wrapper.vm.$nextTick();
      //   await wrapper.vm.$nextTick();
      //   expect(wrapper.vm.$route.path).toEqual(item.subList);
      // });
    });
    describe('when clicking on the delete icon', () => {
      it('emits the delete event', async () => {
        await wrapper.find('[test-delete-icon]').trigger('click');
        expect(wrapper.emitted().delete[0]).toEqual([]);
      });
    });
  });
});

describe('user is not logged in', () => {
  let wrapper;
  let item;

  beforeEach(() => {
    computeSubListPath.mockResolvedValueOnce('list/asdkjfgdjklfhagsdjfhg');
    item = {
      title: 'Test Item',
      isNewItem: false,
      listId: 'test-list',
      subList: 'list/asdkjfgdjklfhagsdjfhg',
    };
    wrapper = mount(ListItem, {
      localVue,
      vuetify,
      router,
      store: localStore,
      propsData: {
        value: item,
        readOnly: true,
      },
    });
  });
  it('should not show make sub list icon', async () => {
    expect(wrapper.find('[test-make-sublist]').exists()).toBe(false);
  });
});
