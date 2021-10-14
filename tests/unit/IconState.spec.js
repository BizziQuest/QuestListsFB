import IconState from '@/components/IconState.vue';
import { mount, createLocalVue } from '@vue/test-utils';
// import Vuex from 'vuex';
// import store from '@/store';
// import VueRouter from 'vue-router';
// import routes from '@/router/routes';
import Vuetify from 'vuetify';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

jest.mock('firebase.js', () => ({
  auth: {
    currentUser: {
      uid: 'alskdaslkd',
    },
  },
  globalPreferences: {
    onSnapshot: jest.fn(),
  },
  ensureSlugUniqueness: jest.fn(),
}));

// now we can say: expect(mockFirebase.ensureSlugUniqueness).toHaveBeenCalled();

toHaveBeenWarnedInit();

const localVue = createLocalVue();
// const router = new VueRouter({ routes });
const vuetify = new Vuetify();
// localVue.use(VueRouter, Vuetify, Vuex);
localVue.use(Vuetify);

let wrapper;

beforeEach(() => {
  wrapper = mount(IconState, {
    localVue,
    // router,
    vuetify,
    // store,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('IconState.vue', () => {
  describe('Entering a new icon', () => {
    describe('validation function', () => {
      it.todo('works when icon is present. Need to figure out how to use js to style :before');
      // , async () => {
      //   document.styleSheets[0].insertRule("[test-icon]::before {content: 'some-content'}", 0);
      //   await wrapper.find('button').trigger('click');
      //   const selectedIcon = wrapper.find('[test-icon]').vm.$el;
      //   // before.vm.$el.style.setProperty('::before', 'some-icon');
      //   // .style.setProperty('content', 'some content');
      //   // window.getComputedStyle(before.vm.$el, '::before').setProperty('content', 'some content');
      //   expect(wrapper.vm.$_validateIconName()).toBe(true);
      // });
    });
    it('should error when entering a non-valid name', async () => {
      await wrapper.find('button').trigger('click');
      const input = wrapper.find('[test-icon-input]');
      await input.setValue('asdasdkodhiodhio');
      expect(wrapper.text()).toContain('asdasdkodhiodhio Not a valid icon name');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should error when not entering an icon name', async () => {
      await wrapper.find('button').trigger('click');
      const input = wrapper.find('[test-icon-input]');
      await input.setValue('');
      expect(wrapper.text()).toContain('icon name is required!');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
    it('should validate when entering a valid icon name', async () => {
      await wrapper.find('button').trigger('click');
      const input = wrapper.find('[test-icon-input]');
      await input.setValue('mdi-flower');
      expect(wrapper.text()).not.toContain('mdi-flower Not a valid icon name');
      expect(wrapper.text()).not.toContain('icon name is required!');
      expect('Unable to locate target [data-app]').toHaveBeenWarned();
    });
  });
});
