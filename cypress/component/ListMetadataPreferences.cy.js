import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import store from '@/store';
import routes from '@/router/routes';
import ListMetadataPreferences from '@/components/preferences/ListMetadataPreferences.vue';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';
import flushPromises from 'flush-promises';

const scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

jest.mock('../../src/algolia.js');

jest.mock('firebase.js', () => ({
  auth: {
    currentUser: {
      uid: 'alskdaslkd',
    },
  },
  ensureSlugUniqueness: jest.fn(),
  reactToPrefsChange: jest.fn(),
}));

// now we can say: expect(mockFirebase.ensureSlugUniqueness).toHaveBeenCalled();

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper;

beforeEach(() => {
  wrapper = mount(ListMetadataPreferences, {
    localVue,
    router,
    vuetify,
    store,
  });
});

afterEach(() => {
  wrapper.destroy();
});


describe('the title field', () => {
  it('should set the vm title from the title input', async () => {
    expect(wrapper.vm.title).toBe(null);
    const titleInput = await wrapper.find('input[test-title-input]');

    // Why TF won't this work?
    await titleInput.trigger('focus');
    await titleInput.setValue('A New Title');
    await titleInput.trigger('blur');
    // await wrapper.vm.$nextTick();
    // await titleInput.trigger('change', 'asdasd');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()['update:title'][0]).toBe({});
    expect(wrapper.vm.title).toBe('A New Title');
  });
  it('should not allow empty titles', async () => {
    wrapper.find('input[test-title-input]').setValue('');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Title is required');
  });
});
describe('the color field', () => {
  it('should not allow invalid colors', async () => {
    await wrapper.find('input[test-color-input]').setValue('HELLO');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
  });
  it('should allow blank/no colors', async () => {
    await wrapper.find('input[test-color-input]').setValue('');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Color ​Description');
  });
  it('should allow 6-digit hexadecimal color strings', async () => {
    await wrapper.find('input[test-color-input]').setValue('#ABC123');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
  });
  it('should allow 6-digit mixed-case hexadecimal color strings', async () => {
    await wrapper.find('input[test-color-input]').setValue('#AbCd23');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
  });
  it('should allow 3 digit hexadecimal color strings', async () => {
    await wrapper.find('input[test-color-input]').setValue('#ABC');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
  });
  it('should allow 3 digit mixed-case hexadecimal color strings', async () => {
    await wrapper.find('input[test-color-input]').setValue('#Abc');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
  });
});
describe('the description field', () => {
  it('should not be required', async () => {
    await wrapper.find('input[test-title-input]').setValue('A Title');
    await wrapper.find('input[test-description-input]').setValue('');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toMatch(/Description\s+Adult Content\s+help/);
  });
  it('should allow simple text', async () => {
    await wrapper.find('input[test-title-input]').setValue('A Tile');
    await wrapper.find('input[test-description-input]').setValue('I am a description');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toMatch(/Description\s+Adult Content\s+help/);
  });
  it('should allow complex text (this is to make sure our tools support complex inputs)', async () => {
    const unicodeString = 'ʕノ•ᴥ•ʔノ ︵ ┻━┻ ✌.ʕʘ‿ʘʔ.✌ 😀';
    await wrapper.find('input[test-title-input]').setValue('A Title');
    await wrapper.find('input[test-description-input]').setValue(unicodeString);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()['update:description'][0][0]).toBe(unicodeString);
    expect(wrapper.text()).toMatch(/Description\s+Adult Content\s+help/);
  });
});
