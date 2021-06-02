jest.mock('../../src/firebase.js');

import { shallowMount, createLocalVue } from '@vue/test-utils';
import List from '@/views/List.vue';
import Vuetify from 'vuetify';
import flushPromises from 'flush-promises'
import { listsCollection } from '../../src/firebase.js';
let wrapper;
const localVue = createLocalVue();
const vuetify = new Vuetify();
// localVue.use(VueRouter, Vuetify);
const $route = { params: { slug: 'list123' } };

beforeEach(() => {
    wrapper = shallowMount(List, {
        localVue,
        vuetify,
        mocks: {
            $route,
            // '../firebase': localFirebase,
        }
    });
});

describe('list item deletion', () => {
    test('when delete icon is clicked item is removed', () => {

        console.log(wrapper.html());
        // expect(fetchList).toHaveBeenCalled();
        expect(listsCollection).toHaveBeenCalled();
        expect(wrapper.text()).toContain('list123');
    })

    test('fetches data', async () => {
        const data = listsCollection.where()
        expect(data).toEqual([])
    })
})