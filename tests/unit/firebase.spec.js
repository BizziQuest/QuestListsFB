jest.mock('../../src/firebase.js');

import flushPromises from 'flush-promises'
import { getListBySlug } from '../../src/firebase.js';

test('firebase mock should resolve properly', async () => {
    expect.assertions(2)
    const data = await getListBySlug();
    await flushPromises();
    expect(getListBySlug.mock.calls.length).toBe(1);
    expect(data).toEqual([]);
});
