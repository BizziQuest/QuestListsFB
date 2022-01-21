import { mount, createLocalVue } from '@vue/test-utils';
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
  let stateGroup ={ states: [ {
    text: 'New State',
    icon: 'mdi-plus',
    value: 'whatever',
  }]};
  beforeEach( () => {
    wrapper = mount(StatesEditor, {
      localVue,
      vuetify,
      store: localStore,
      propsData: {
        stateGroup
      },
    });
    // await flushPromises(); // for fetchList() call in List.mounted()
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
  it.todo('should add new items when typing in the new item field');
  it.todo('should update the icon in the list when updating an icon in an item editor');
  it.todo('should save with the correct data');
})
