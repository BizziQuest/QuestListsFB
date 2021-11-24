/* eslint-disable no-undef */

export const getListBySlug = jest.fn(() => Promise.resolve([]));

export const getListItems = jest.fn(() => Promise.resolve([]));

export const getListStates = jest.fn(() => Promise.resolve([]));

export const saveListItems = jest.fn(() => Promise.resolve([]));

export const auth = jest.fn(() => Promise.resolve({ currentUser: {} }));

export const globalPrefRef = jest.fn(() => Promise.resolve({ currentUser: {} }));

export const globalPreferences = jest.fn(() => Promise.resolve({ }));

export const stateGroupsCollection = jest.fn(() => Promise.resolve({ }));

export const getStateGroup = jest.fn(() => Promise.resolve({ }));

export const createList = jest.fn(() => ({}));

export const computeSubListPath = jest.fn(() => Promise.resolve(''));

export const reactToPrefsChange = jest.fn(() => Promise.resolve(''));
