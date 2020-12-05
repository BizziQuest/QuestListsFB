import TopMenuBar from '@/components/Menus/TopMenuBar.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import vuetify from 'vuetify';
import router from '@/router';
import store from '@/store';

let wrapper = null;
const localVue = createLocalVue();
localVue.use(vuetify);
wrapper = shallowMount(TopMenuBar, {
  localVue,
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

beforeEach(() => {
});

afterEach(() => {
  // wrapper.destroy();
});

describe('Top Menu Bar', () => {
  it('component include text Lists', () => {
    // expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.font-weight-light').text()).toContain('Lists');
  });
});
