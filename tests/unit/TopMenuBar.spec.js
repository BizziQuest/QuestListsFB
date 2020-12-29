import Vue from 'vue';
import TopMenuBar from '@/components/Menus/TopMenuBar.vue';
import { shallowMount } from '@vue/test-utils';
import vuetify from 'vuetify';
import router from '@/router';
import store from '@/store';

let wrapper = null;
// const localVue = createLocalVue();
// seemingly there is a bug with using vuetify
// with localVue
Vue.use(vuetify);
wrapper = shallowMount(TopMenuBar, {
  // localVue,
  store,
  router,
});

// beforeEach(() => {

//   wrapper = shallowMount(TopMenuBar, {
//     localVue,
//     router,
//     store,
//     propsData: { },
//   });
//   console.debug(wrapper);
// });

// beforeEach(() => {
// });

afterEach(() => {
  // wrapper.destroy();
});

describe('Top Menu Bar', () => {
  it('component include text Lists', (done) => {
    // expect(wrapper.html()).toMatchSnapshot();
    try {
      expect(wrapper.find('.font-weight-light').text()).toContain('Lists');
      done();
    } catch (e) {
      done(e);
    }
  });
});
