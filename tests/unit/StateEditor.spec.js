import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import StatesEditor from '../../src/components/StatesEditor.vue';

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

describe('StatesEditor.vue', () => {
  let wrapper;
  const stateGroup = {
    states: [
      {
        text: 'Sample State For Test',
        icon: 'mdi-plus',
      },
    ],
  };
  beforeEach(() => {
    wrapper = mount(StatesEditor, {
      localVue,
      vuetify,
      store: localStore,
      propsData: {
        stateGroup,
      },
    });
  });

  it('should show the defaults states and new item', () => {
    const allDefaultListItem = wrapper.findAll('[test-list-item]');
    expect(allDefaultListItem.length).toBe(2);
    expect(wrapper.props().stateGroup).toEqual(stateGroup);
  });

  it('should remove the item from the list on item delete', async () => {
    const allDefaultListItem = wrapper.findAll('[list-state-test]');
    expect(allDefaultListItem.length).toBe(2);
    await wrapper.vm.deleteListState(0);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.items.length).toBe(1);
    expect(wrapper.findAll('[list-state-test]').length).toBe(1);
  });
  it('should add new items when typing in the new item field', async () => {
    let allListItems = wrapper.findAll('[list-state-test]');
    expect(allListItems.length).toBe(2);
    const newItem = wrapper.find('[draggable="false"]');
    await newItem.find('[test-text-field]').setValue('something something');
    await newItem.trigger('update:item');
    allListItems = wrapper.findAll('[list-state-test]');
    expect(allListItems.length).toBe(3);
  });
  it('should update the icon and text in the list when updating an icon in an item editor', async () => {
    const firstListState = wrapper.findAll('[list-state-test]').wrappers[0];
    await firstListState.setData({ item: { text: 'some text', icon: 'mdi-flower' } });
    wrapper.vm.updateItem(0, { text: 'some text', icon: 'mdi-flower' });
    expect(wrapper.vm.items[0].icon).toEqual('mdi-flower');
    expect(wrapper.vm.items[0].text).toEqual('some text');
  });

  it('should send the updated event with the correct data', async () => {
    const updatedItemValue = { text: 'some text', icon: 'mdi-flower' };
    const firstListState = wrapper.findAll('[list-state-test]').wrappers[0];
    await firstListState.setData({ item: updatedItemValue });
    wrapper.vm.updateItem(0, updatedItemValue);
    expect(wrapper.emitted()['list:updated'][0][0][0]).toStrictEqual(updatedItemValue);
  });
});
