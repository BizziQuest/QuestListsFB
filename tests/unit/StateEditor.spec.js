import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import StatesEditor from '../../src/components/StatesEditor.vue';
// import IconState from '../../src/components/IconState.vue';
import ListState from '../../src/components/ListState.vue';
// import { saveListItems, getListBySlug, getListItems } from '../../src/firebase';

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

describe('StatesEditor.vue', () => {
  let wrapper;
  let stateGroup = {
    states: [{
      text: 'New State',
      icon: 'mdi-plus',
    }]
  };
  beforeEach(() => {
    wrapper = mount(StatesEditor, {
      localVue,
      vuetify,
      store: localStore,
      propsData: {
        stateGroup
      },
    });
  });

  it('should show the defaults states and new item', () => {
    const allDefultListItem = wrapper.findAll('[test-list-item]');
    expect(allDefultListItem.length).toBe(2)
    expect(wrapper.props().stateGroup).toEqual(stateGroup)
  })

  it('should remove the item from the list on item delete', async () => {
    const allDefultListItem = wrapper.findAll('[test-list-item]');
    expect(allDefultListItem.length).toBe(2)
    await allDefultListItem.wrappers[0].trigger('delete:item')
    expect(allDefultListItem.length).toBe(1)
  })
  it('should add new items when typing in the new item field', async () => {
    let allListItems = wrapper.findAll('[list-state-test]');
    expect(allListItems.length).toBe(2)
    const newItem = wrapper.find('[draggable="false"]')
    await newItem.find('[test-text-field]').setValue('something something')
    await newItem.trigger('update:item')
    allListItems = wrapper.findAll('[list-state-test]');
    expect(allListItems.length).toBe(3)
  });
  it('should update the icon and text in the list when updating an icon in an item editor', async () => {
    let firstListState = wrapper.findAll('[list-state-test]').wrappers[0];
    await firstListState.setData({item: { text: 'some text', icon: 'mdi-flower' }});
    await firstListState.find('input').trigger('blur');
    expect(wrapper.emitted()['list:updated'][0][0][0].icon).toEqual('mdi-flower')
    expect(wrapper.emitted()['list:updated'][0][0][0].text).toEqual('some text')

  });
  it.todo('should save with the correct data');
})
