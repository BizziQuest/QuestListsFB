jest.mock('../../src/firebase.js');

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import List from '@/views/List.vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises'
import { getListBySlug } from '../../src/firebase.js';
let wrapper;
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
beforeEach( () => {
    const items = [{ id: "1", data: () => ({title: 'list123'}) }]
    getListBySlug.mockResolvedValueOnce(items);
    wrapper = mount(List, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
            $route,
        }
    });
});

describe('list item deletion', () => {
    test('when delete icon is clicked item is removed', async () => {
        expect(getListBySlug).toHaveBeenCalled();
        // await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.list['id']).toBe('1');
        expect(wrapper.vm.list.title).toBe('list123');
        expect(wrapper.vm.listItems).toEqual([{isNewItem: true, title: ''}]);
        expect(wrapper.vm.states).toStrictEqual([]);
        expect(wrapper.text()).toContain('list123');
    })
})