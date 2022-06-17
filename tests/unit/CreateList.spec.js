import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import store from '@/store';
import routes from '@/router/routes';
import CreateList from '@/components/CreateList.vue';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

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
  wrapper = mount(CreateList, {
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
    wrapper = mount(CreateList, {
      localVue,
      router,
      vuetify,
      store,
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
        globalPreferences: {
          defaultStateGroup: { states: [{ icon: 'default', name: 'default' }] },
        },
      },
    });
    wrapper = mount(CreateList, {
      data() {
        return {
          title: 'Test List',
          description: 'Rando Description',
          color: '#fff',
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
    wrapper.vm.color = 'kajsbfkajsb';
    wrapper.vm.createList();
    expect(actions.createList).not.toHaveBeenCalled();
  });
  it('should notify users when there are no states given.', async () => {
    await wrapper.vm.$nextTick();
    await wrapper.vm.createList();
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
    await wrapper.vm.createList();
    expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
    expect(actions.notify.mock.calls[0][1]).toEqual(
      { type: 'info', text: 'No states configured. Using default states.' },
    );
    const createParams = actions.createList.mock.calls[0][1];
    expect(createParams.stateGroup).toStrictEqual({ states: [{ icon: 'default', name: 'default' }] });
    expect(createParams.adultContent).toStrictEqual(true);
  });
  it('should notify users when there are no states given.', async () => {
    await wrapper.find('input[test-title-input]').setValue('A New Title');
    wrapper.find('[test-submit-form]').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.vm.createList();
    expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
    expect(actions.notify.mock.calls[0][1]).toEqual(
      { type: 'info', text: 'No states configured. Using default states.' },
    );
    const createParams = actions.createList.mock.calls[0][1];
    expect(createParams.stateGroup).toStrictEqual({ states: [{ icon: 'default', name: 'default' }] });
  });

  // TODO: move this into ColorPicker
  it.todo('should show the color picker when the color picker icon is clicked.');
  it.todo('should set the color of the color picker icon when the color picker menu is closed.');
});
