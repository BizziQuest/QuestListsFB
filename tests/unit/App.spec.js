import { shallowMount } from '@vue/test-utils';
import App from '../src/components/App.vue';

describe('App.vue', () => {
  it('renders a header and sidebar', () => {
    const wrapper = shallowMount(App, {
      propsData: { },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
