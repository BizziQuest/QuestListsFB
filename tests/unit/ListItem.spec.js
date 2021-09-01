import ListItem from '@/components/ListItem.vue';
import { mount, createLocalVue } from '@vue/test-utils';
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

let wrapper = null;

describe('default state', () => {
  beforeEach(() => {
    wrapper = mount(ListItem, {
      localVue,
      router,
      vuetify,
      store,
    });
  });
  afterEach(() => {
    wrapper.destroy();
  });
  it('should not make sub list on empty text filed', async () => {
    await wrapper.find('[test-make-sublist]').trigger('click');
    expect(wrapper.html()).toContain('Title is required');
  });
  it('should make sublist on filled text filed', async () => {
    const sublistSpy = jest.spyOn(wrapper.vm, 'makeSublist');
    const textInput = wrapper.find('input[type="text"]');
    await textInput.setValue('some value');
    await wrapper.find('[test-make-sublist]').trigger('click');
    await wrapper.vm.$forceUpdate();
    expect(sublistSpy).toHaveBeenCalled();
  });
});
