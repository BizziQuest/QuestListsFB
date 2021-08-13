import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Increment from '@/components/Increment.vue';

describe('Increment.vue', () => {
  let localVue;
  let vuetify;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    wrapper = mount(Increment, {
      localVue,
      vuetify,
      //   Like attachTo, but automatically creates a new div element for
      //   you and inserts it into the body.When attaching to the DOM, you
      //   should call wrapper.destroy() at the end of your test to remove
      //   the rendered elements from the document and destroy the
      //   component instance
      attachTo: document.body,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should render the card and the button', () => {
    expect(wrapper.find('[data-testid="increment-card"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="increment-button"]').exists()).toBe(true);
  });
});
