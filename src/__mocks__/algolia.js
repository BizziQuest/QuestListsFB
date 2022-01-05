/* eslint-disable no-undef */

export const algolia = jest.fn(() => Promise.resolve({
  initIndex: jest.fn(() => Promise.resolve({})),
}));
export const algoliaIndex = {
  setSettings: jest.fn(),
  search: jest.fn(() => Promise.resolve({})),
  saveObject: jest.fn(() => Promise.resolve({})),
};
