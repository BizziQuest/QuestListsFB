import CreateAList from '@/components/CreateAList.vue';
import { mount, createLocalVue } from '@vue/test-utils';
// import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store';
import VueRouter from 'vue-router';
import routes from '@/router/routes';
import Vuetify from 'vuetify';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper;

beforeEach(() => {
  wrapper = mount(CreateAList, {
    localVue,
    router,
    vuetify,
    store,
  });
});

describe('default state', () => {
  it('should render "create a list"', () => {
    expect(wrapper.findComponent({ name: 'VListItem' }).text()).toBe('add create a list');
  });
  it('should not show the dialog', () => {
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(false);
  });
});

describe('clicking on the link', () => {
  beforeEach(() => {
    wrapper = mount(CreateAList, {
      localVue,
      router,
      vuetify,
      store,
    });
  });
  it('should show the correct dialog', async () => {
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(false);
    await wrapper.findComponent({ name: 'VListItem' }).trigger('click');
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(true);
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
});

describe('entering information in the dialog', () => {
  beforeEach(async () => {
    wrapper = mount(CreateAList, {
      localVue,
      router,
      vuetify,
      store,
    });
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(false);
    await wrapper.findComponent({ name: 'VListItem' }).trigger('click');
  });
  describe('the title field', () => {
    it('should set the vm title from the title input', async () => {
      expect(wrapper.vm.title).toBe('');
      await wrapper.find('input[placeholder="Your Title"]').setValue('A New Title');
      expect(wrapper.vm.title).toBe('A New Title');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should not allow empty titles', async () => {
      await wrapper.find('input[placeholder="Your Title"]').setValue('');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toContain('Title is required');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
  describe('the color field', () => {
    it('should not allow invalid colors', async () => {
      await wrapper.find('input[placeholder="#FFFFFF"]').setValue('HELLO');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 6-digit hexadecimal color strings', async () => {
      await wrapper.find('input[placeholder="#FFFFFF"]').setValue('#ABC123');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 6-digit mixed-case hexadecimal color strings', async () => {
      await wrapper.find('input[placeholder="#FFFFFF"]').setValue('#AbCd23');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 3 digit hexadecimal color strings', async () => {
      await wrapper.find('input[placeholder="#FFFFFF"]').setValue('#ABC');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 3 digit mixed-case hexadecimal color strings', async () => {
      await wrapper.find('input[placeholder="#FFFFFF"]').setValue('#Abc');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
  describe('the description field', () => {
    it('should not be required', async () => {
      await wrapper.find('input[placeholder="Your Title"]').setValue('A Tile');
      await wrapper.find('input[placeholder="Describe your list purpose."]').setValue('');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Possible/);
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow simple text', async () => {
      await wrapper.find('input[placeholder="Your Title"]').setValue('A Tile');
      await wrapper.find('input[placeholder="Describe your list purpose."]').setValue('I am a description');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Possible/);
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow complex text (this is to make sure our tools support complex inputs)', async () => {
      const unicodeString = 'ʕノ•ᴥ•ʔノ ︵ ┻━┻ ✌.ʕʘ‿ʘʔ.✌ 😀';
      await wrapper.find('input[placeholder="Your Title"]').setValue('A Tile');
      await wrapper.find('input[placeholder="Describe your list purpose."]').setValue(unicodeString);
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.vm.description).toEqual(unicodeString);
      expect(wrapper.text()).toMatch(/Description\s+Possible/);
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
  it('should not allow empty states', async () => {
    wrapper.vm.title = 'test';
    wrapper.vm.updatedListStatesItems = [];
    wrapper.vm.color = '#fff';
    await wrapper.vm.createAList();
    expect(wrapper.text()).toContain('No states configured. Using default states.');
  });
});
