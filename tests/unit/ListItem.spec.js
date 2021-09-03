import ListItem from '@/components/ListItem.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import store from '@/store';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import Vuetify from 'vuetify';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper = null;

describe('default state', () => {
  beforeEach(() => {
    wrapper = mount(ListItem, {
      localVue,
      router,
      vuetify,
      store,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should not make sub list on empty text filed', async () => {
    await wrapper.find('[test-make-sublist]').trigger('click');
    expect(wrapper.html()).toContain('Title is required');
  });
  it('should make sublist on filled text filed', async () => {
    const sublistSpy = jest.spyOn(wrapper.vm, 'makeSublist');
    const textInput = wrapper.find('input[type="text"]');
    await textInput.setValue('some value');
    await wrapper.find('[test-make-sublist]').trigger('click');
    await wrapper.vm.$forceUpdate();
    expect(sublistSpy).toHaveBeenCalled();
import { mount, createLocalVue } from '@vue/test-utils';
import ListItem from '@/components/ListItem.vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

jest.mock('../../src/firebase.js');

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
