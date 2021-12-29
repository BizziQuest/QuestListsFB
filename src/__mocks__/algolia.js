export const algolia = jest.fn(() => Promise.resolve({
    initIndex: jest.fn((_id, _key) => Promise.resolve({})),
}));
export const algoliaIndex = jest.fn(() => Promise.resolve({
    setSettings: jest.fn(),
    search: jest.fn((searchTerms) => Promise.resolve({})),
    saveObject: jest.fn((object) => Promise.resolve({})),
}));
