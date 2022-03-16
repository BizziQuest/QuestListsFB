import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { storeConfig } from '../../src/store/index';

jest.mock('../../src/firebase.js');

const localVue = createLocalVue();
localVue.use(Vuex);
const testStoreConfig = { ...storeConfig };
testStoreConfig.actions.notify = jest.fn();
const store = new Vuex.Store(testStoreConfig);

describe('saving profile', () => {
  it('should notify users when a profile is saved', () => {
    store.dispatch('saveProfile', { avatar: 'some/image.gif' });
    expect(testStoreConfig.actions.notify.mock.calls).toBe([]);
  });
  it('should notify users when a profile is NOT saved', () => {});
});
