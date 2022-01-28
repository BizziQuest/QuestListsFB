import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import store from '@/store';
import routes from '@/router/routes';
import CreateAList from '@/components/CreateAList.vue';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

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
  wrapper = mount(CreateAList, {
    localVue,
    router,
    vuetify,
    store,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('entering information in the page', () => {
  beforeEach(async () => {
    wrapper = mount(CreateAList, {
      localVue,
      router,
      vuetify,
      store,
    });
  });
  describe('the title field', () => {
    it('should set the vm title from the title input', async () => {
      expect(wrapper.vm.title).toBe('');
      await wrapper.find('input[test-title-input]').setValue('A New Title');
      expect(wrapper.vm.title).toBe('A New Title');
    });
    it('should not allow empty titles', async () => {
      wrapper.find('input[test-title-input]').setValue('');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toContain('Title is required');
    });
  });
  describe('the color field', () => {
    it('should not allow invalid colors', async () => {
      await wrapper.find('input[test-color-input]').setValue('HELLO');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
    });
    it('should allow 6-digit hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#ABC123');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
    });
    it('should allow 6-digit mixed-case hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#AbCd23');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
    });
    it('should allow 3 digit hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#ABC');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
    });
    it('should allow 3 digit mixed-case hexadecimal color strings', async () => {
      await wrapper.find('input[test-color-input]').setValue('#Abc');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).not.toContain('Color Format Must be #FFF or #FFFFFF, case-insensitive');
    });
  });
  describe('the description field', () => {
    it('should not be required', async () => {
      await wrapper.find('input[test-title-input]').setValue('A Title');
      await wrapper.find('input[test-description-input]').setValue('');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Adult Content\s+help\s+Possible/);
    });
    it('should allow simple text', async () => {
      await wrapper.find('input[test-title-input]').setValue('A Tile');
      await wrapper.find('input[test-description-input]').setValue('I am a description');
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Adult Content\s+help\s+Possible/);
    });
    it('should allow complex text (this is to make sure our tools support complex inputs)', async () => {
      const unicodeString = 'ʕノ•ᴥ•ʔノ ︵ ┻━┻ ✌.ʕʘ‿ʘʔ.✌ 😀';
      await wrapper.find('input[test-title-input]').setValue('A Title');
      await wrapper.find('input[test-description-input]').setValue(unicodeString);
      expect(wrapper.vm.description).toEqual(unicodeString);
      await wrapper.find('.v-btn[name="submit"]').trigger('click');
      expect(wrapper.text()).toMatch(/Description\s+Adult Content\s+help\s+Possible/);
    });
  });
  it.todo('should not allow empty states');
});

describe('list creation', () => {
  let actions;
  let getters;
  beforeEach(async () => {
    getters = {
      getGlobalPreferences() {
        return {
          defaultStateGroup: {
            states: [],
          },
        };
      },
    };
    actions = {
      createList: jest.fn(),
      notify: jest.fn(),
    };
    const localStore = new Vuex.Store({
      actions,
      getters,
      watch: {
        dialog() {
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
      mocks: {
        auth: {
          currentUser: {
            uid: 'TestUserUID',
          },
        },
      },
    });
  });
  it('should do nothing if the title and color form does not validate', () => {
    wrapper.vm.title = '123';
    wrapper.vm.listColor = 'kajsbfkajsb';
    wrapper.vm.createAList();
    expect(actions.createList).not.toHaveBeenCalled();
  });
  it('should notify users when there are no states given.', async () => {
    await wrapper.vm.$nextTick();
    await wrapper.vm.createAList();
    expect(actions.notify.mock.calls[0][1]).toEqual(
      { type: 'info', text: 'No states configured. Using default states.' },
    );
    expect(actions.createList).toHaveBeenCalled();
  });

  it('should create the list with the proper parameters', async () => {
    wrapper.find('[test-adult-content]').trigger('click');
    await wrapper.find('input[test-title-input]').setValue('A New Title');
    wrapper.find('[test-submit-form]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.createAList();
    expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
    expect(actions.notify.mock.calls[0][1]).toEqual(
      { type: 'info', text: 'No states configured. Using default states.' },
    );
    const createParams = actions.createList.mock.calls[0][1];
    expect(createParams.stateGroup).toStrictEqual({ states: [] });
    expect(createParams.adultContent).toStrictEqual(true);
  });
  it('should notify users when there are no states given.', async () => {
    await wrapper.find('input[test-title-input]').setValue('A New Title');
    wrapper.find('[test-submit-form]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.createAList();
    expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
    expect(actions.notify.mock.calls[0][1]).toEqual(
      { type: 'info', text: 'No states configured. Using default states.' },
    );
    const createParams = actions.createList.mock.calls[0][1];
    expect(createParams.stateGroup).toStrictEqual({ states: [] });
  });

  it.todo('should show the color picker when the color picker icon is clicked.');
  it.todo('should set the color of the color picker icon when the color picker menu is closed.');
});
