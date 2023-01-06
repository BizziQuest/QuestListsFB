// import {stub} from 'cypress';
// import { mount } from 'cypress/vue';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
// import { createVuetify } from 'vuetify';
import CreateList from '../../src/components/CreateList.vue';
import routes from '../../src/router/routes';


// const scrollIntoViewMock = jest.fn();
// window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

// jest.mock('../../src/algolia.js');

// jest.mock('firebase.js', () => ({
//   auth: {
//     currentUser: {
//       uid: 'alskdaslkd',
//     },
//   },
//   ensureSlugUniqueness: jest.fn(),
//   reactToPrefsChange: jest.fn(),
// }));

// now we can say: expect(mockFirebase.ensureSlugUniqueness).toHaveBeenCalled();

// toHaveBeenWarnedInit();

const localVue = createApp(CreateList);
const router = createRouter({ routes, history: createWebHashHistory });
// const vuetify = createVuetify();
// localVue.use(Vuetify, Vuex);

let wrapper;

beforeEach(() => {
  wrapper = cy.mount(CreateList, {
    // localVue,
    // router,
    // Vuetify,
    // store,
  });
  // cy.stub(algolia, {})
  // cy.stub(firebase, {
  // auth: {
  //   currentUser: {
  //     uid: 'alskdaslkd',
  //   },
  // },
  // ensureSlugUniqueness: () => {},
  // reactToPrefsChange: () => {},
// })

});

afterEach(() => {
  // wrapper.destroy();
});

describe('entering information in the page', () => {
  // beforeEach(async () => {
  //   wrapper = cy.mount(CreateList, {
  //     localVue,
  //     router,
  //     vuetify,
  //     store,
  //   });
  // });

  it.skip('should not allow empty states');
});

describe('list creation', () => {
  // let actions;
  // let getters;
  // beforeEach(async () => {
  //   getters = {
  //     getGlobalPreferences() {
  //       return {
  //         defaultStateGroup: {
  //           states: [],
  //         },
  //       };
  //     },
  //   };
  //   actions = {
  //     createList: () => {},
  //     notify: () => {},
  //   };
  //   const localStore = new Vuex.Store({
  //     actions,
  //     getters,
  //     watch: {
  //       dialog() {
  //         () => {};
  //       },
  //     },
  //     state: {
  //       currentUser: {
  //         emailVerified: true,
  //         uid: 'UUID1',
  //       },
  //       globalPreferences: {
  //         defaultStateGroup: { states: [{ icon: 'default', name: 'default' }] },
  //       },
  //     },
  //   });
  //   wrapper = cy.mount(CreateList, {
  //     data() {
  //       return {
  //         title: 'Test List',
  //         description: 'Rando Description',
  //         color: '#fff',
  //       };
  //     },
  //     // localVue,
  //     router,
  //     // vuetify,
  //     store: localStore,
  //     mocks: {
  //       auth: {
  //         currentUser: {
  //           uid: 'TestUserUID',
  //         },
  //       },
  //     },
  //   });
  // });
  // it.skip('should do nothing if the title and color form does not validate', () => {
  //   cy.get('[test-title]').value = '123';
  //   wrapper.vm.color = 'kajsbfkajsb';
  //   wrapper.vm.createList();
  //   expect(actions.createList).not.toHaveBeenCalled();
  // });
  it('should notify users when there are no states given.', async () => {
    // cy.stub('firebase', {})
    cy.mount(CreateList);
    cy.get('[test-save-button]').click()
    // await wrapper.vm.$nextTick();
    // await wrapper.vm.createList();
    // expect(actions.notify.mock.calls[0][1]).toEqual(
    //   { type: 'info', text: 'No states configured. Using default states.' },
    // );
    // expect(actions.createList).toHaveBeenCalled();
  });

  // it('should create the list with the proper parameters', async () => {
  //   wrapper.find('[test-adult-content]').trigger('click');
  //   await wrapper.find('input[test-title-input]').setValue('A New Title');
  //   wrapper.find('[test-submit-form]').trigger('click');
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.createList();
  //   expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
  //   expect(actions.notify.mock.calls[0][1]).toEqual(
  //     { type: 'info', text: 'No states configured. Using default states.' },
  //   );
  //   const createParams = actions.createList.mock.calls[0][1];
  //   expect(createParams.stateGroup).toStrictEqual({ states: [{ icon: 'default', name: 'default' }] });
  //   expect(createParams.adultContent).toStrictEqual(true);
  // });
  // it('should notify users when there are no states given.', async () => {
  //   await wrapper.find('input[test-title-input]').setValue('A New Title');
  //   wrapper.find('[test-submit-form]').trigger('click');
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.createList();
  //   expect(wrapper.vm.$refs.addTitleAndColorForm.validate()).toBe(true);
  //   expect(actions.notify.mock.calls[0][1]).toEqual(
  //     { type: 'info', text: 'No states configured. Using default states.' },
  //   );
  //   const createParams = actions.createList.mock.calls[0][1];
  //   expect(createParams.stateGroup).toStrictEqual({ states: [{ icon: 'default', name: 'default' }] });
  // });

  // // TODO: move this into ColorPicker
  // it.skip('should show the color picker when the color picker icon is clicked.');
  // it.skip('should set the color of the color picker icon when the color picker menu is closed.');
});
