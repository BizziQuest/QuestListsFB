import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import ListState from '../../src/components/ListState.vue';

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

describe('ListState.vue', () => {
  let wrapper;
  const item = { text: 'some item text' };
  beforeEach(async () => {
    wrapper = mount(ListState, {
      vuetify,
      store: localStore,
      propsData: {
        item,
      },
    });
    await flushPromises(); // for fetchList() call in List.mounted()
  });

  it('should receive a prop item from its parent', () => {
    expect(wrapper.props().item.text).toBe('some item text');
  });

  test('calls del when icon is clicked', async () => {
    jest.spyOn(wrapper.vm, 'del');
    wrapper.find('[test-delete-icon]').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.del).toHaveBeenCalled();
  });
  it('del emits return right object to the parent', () => {
    wrapper.vm.del(wrapper.props().item);
    expect(wrapper.emitted()['delete:item'][0]).toEqual([item]);
  });

  it('chaging text will emitt a change event', async () => {
    jest.spyOn(wrapper.vm, 'isChanging');
    await wrapper.find('[test-text-field]').setValue('the text is changed');
    expect(wrapper.emitted()['update:item'][0]).toEqual([{ icon: undefined, text: 'the text is changed' }]);
  });

  it('update text will emitt a change event', async () => {
    jest.spyOn(wrapper.vm, 'updateText');
    const txtField = wrapper.find('[test-text-field]');
    await txtField.setValue('blured text value');
    await txtField.trigger('blur');
    expect(wrapper.emitted().blur[0]).toEqual([{ icon: undefined, text: 'blured text value' }]);
  });
});
