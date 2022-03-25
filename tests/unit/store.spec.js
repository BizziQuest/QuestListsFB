/* eslint-disable arrow-body-style */
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { storeConfig } from '../../src/store/index';

jest.mock('../../src/firebase.js');
jest.mock('../../src/algolia.js');
jest.mock('firebase/auth', () => ({
  updateProfile: jest.fn(() => Promise.resolve()),
}));

const localVue = createLocalVue();
localVue.use(Vuex);
const testStoreConfig = { ...storeConfig };
testStoreConfig.actions.notify = jest.fn();
const store = new Vuex.Store(testStoreConfig);

describe('saving profile', () => {
  it('should notify users when a profile is saved', async () => {
    await store.dispatch('saveProfile', { avatar: 'some/image.gif', displayName: 'Test User' });
    expect(testStoreConfig.actions.notify.mock.calls[0][1]).toEqual({ text: 'Profile has been saved.', type: 'info' });
  });
  it('should notify users when a profile is NOT saved', async () => {
    testStoreConfig.actions.notify.mockClear();
    jest.mock('firebase/auth', () => ({
      updateProfile: jest.fn(() => Promise.reject(new Error('NO!'))),
    }));

    await store.dispatch('saveProfile', { avatar: 'some/image.gif' });
    expect(testStoreConfig.actions.notify.mock.calls[0][1]).toEqual({
      text: 'There was an error saving profile. Please try again later.',
      timeout: 10000,
      error: 'NO!',
      type: 'danger',
    });
  });
});
