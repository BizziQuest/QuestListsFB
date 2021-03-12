import CreateAList from '@/components/CreateAList.vue';
import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
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
  it('should render "New Quest"', () => {
    expect(wrapper.findComponent({ name: 'VListItem' }).text()).toBe('add New Quest');
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
      await wrapper.find('input[test-title-input]').setValue('A New Title');
      expect(wrapper.vm.title).toBe('A New Title');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should not allow empty titles', async () => {
      wrapper.find('input[test-title-input]').setValue('');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toContain('Title is required');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
  describe('the color field', () => {
    it('should not allow invalid colors', async () => {
      await wrapper.find('input[test-color-input]').setValue('HELLO');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 6-digit hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#ABC123');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 6-digit mixed-case hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#AbCd23');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 3 digit hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#ABC');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow 3 digit mixed-case hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#Abc');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
  describe('the description field', () => {
    it('should not be required', async () => {
      await wrapper.find('input[test-title-input]').setValue('A Title');
      await wrapper.find('input[test-description-input]').setValue('');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Possible/);
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow simple text', async () => {
      await wrapper.find('input[test-title-input]').setValue('A Tile');
      await wrapper.find('input[test-description-input]').setValue('I am a description');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Possible/);
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should allow complex text (this is to make sure our tools support complex inputs)', async () => {
      const unicodeString = 'ʕノ•ᴥ•ʔノ ︵ ┻━┻ ✌.ʕʘ‿ʘʔ.✌ 😀';
      await wrapper.find('input[test-title-input]').setValue('A Title');
      await wrapper.find('input[test-description-input]').setValue(unicodeString);
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.vm.description).toEqual(unicodeString);
      expect(wrapper.text()).toMatch(/Description\s+Possible/);
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
  it.todo('should not allow empty states');
});

describe('list creation', () => {
  let actions;
  let getters;
  let mutations;
  beforeEach(() => {
    getters = {
      getGlobalPreferences() {
        return {
          defaultStateGroup: {
            states: [],
          },
        };
      },
    };
    mutations = {
      setMessages: jest.fn(),
    };
    actions = {
      createList: jest.fn(),
    };
    const localStore = new Vuex.Store({
      actions,
      getters,
      mutations,
      watch: {
        dialog(_val) {
          jest.fn();
        },
      },
      state: {
        currentUser: {
          emailVerified: true,
          uid: 'UUID1',
        },
      },
    });
    wrapper = mount(CreateAList, {
      data() {
        return {
          title: 'Test List',
          description: 'Rando Description',
          listColor: '#fff',
        };
      },
      localVue,
      router,
      vuetify,
      store: localStore,
    });
  });
  it('should do nothing if the title and color form does not validate', () => {
    wrapper.vm.title = '123';
    wrapper.vm.listColor = 'kajsbfkajsb';
    wrapper.vm.createAList();
    expect(actions.createList).not.toHaveBeenCalled();
    // the following needs to be commented when testing this independently.
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should notify users when there are no states given.', async () => {
    wrapper.find('[test-activate-item]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.createAList();
    expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
    expect(mutations.setMessages).toHaveBeenCalled();
    expect(actions.createList).not.toHaveBeenCalled();
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should notify users when there are no states given.', async () => {
    wrapper.find('[test-activate-item]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.createAList();
    expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
    expect(wrapper.vm.updatedListStatesItems.length).not.toBeGreaterThan(0);
    expect(mutations.setMessages).toHaveBeenCalled();
    expect(actions.createList).toHaveBeenCalledWith();
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
});
