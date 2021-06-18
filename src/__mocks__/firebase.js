// import { currentUser } from "../firebase"
import jest from 'jest';

export const getListBySlug = jest.fn(() => Promise.resolve([]));

export const getListItems = jest.fn(() => Promise.resolve([]));

export const getListStates = jest.fn(() => Promise.resolve([]));

export const saveListItems = jest.fn(() => Promise.resolve([]));
export const auth = jest.fn(() => Promise.resolve({ currentUser: {} }));
