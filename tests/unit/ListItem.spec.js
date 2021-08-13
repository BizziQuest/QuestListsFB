import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import ListItem from '@/components/ListItem.vue';

describe('ListItem.vue', () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();

    wrapper = mount(ListItem, {
      localVue,
      vuetify,
      attachTo: document.body,
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test('button with title delete should not exists by default', () => {
    // const delButton = warpper.find(button)
    // expect(wrapper.attributes()['data-title']).toBe('delete');
    expect(wrapper.find('[title="delete"]').exists()).toBe(true);
  });
});
