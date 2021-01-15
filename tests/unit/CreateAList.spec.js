import CreateAList from '@/components/CreateAList.vue';
import { mount, createLocalVue } from '@vue/test-utils';
// import Vue from 'vue';
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

let wrapper;

beforeEach(() => {
  wrapper = mount(CreateAList, {
    localVue,
    router,
    vuetify,
    store,
  });
});

describe('default state', () => {
  it('should render "create a list"', () => {
    expect(wrapper.findComponent({ name: 'VListItem' }).text()).toBe('add create a list');
  });
  it('should not show the dialog', () => {
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(false);
  });
});

describe('clicking on the link', () => {
  beforeEach(() => {
    wrapper = mount(CreateAList, {
      localVue,
      router,
      vuetify,
      store,
    });
  });
  it('should show the correct dialog', async () => {
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(false);
    await wrapper.findComponent({ name: 'VListItem' }).trigger('click');
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(true);
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
});

describe('entering information in the dialog', () => {
  beforeEach(async () => {
    wrapper = mount(CreateAList, {
      localVue,
      router,
      vuetify,
      store,
    });
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(false);
    await wrapper.findComponent({ name: 'VListItem' }).trigger('click');
  });
  it('should set the vm title from the title input', async () => {
    expect(wrapper.vm.title).toBe('');
    await wrapper.find('input[placeholder="Your Title"]').setValue('A New Title');
    expect(wrapper.vm.title).toBe('A New Title');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it('should not allow empty titles', async () => {
    await wrapper.find('.v-btn[name="submit"]').trigger('click');
    expect(wrapper.text()).toContain('Title is required');
    expect('Unable to locate target [data-app]').toHaveBeenWarned();
  });
  it.todo('should not allow invalid colors');
  it.todo('should enforce a title');
  it.todo('should allow a descripton');
  it.todo('should not allow empty states');
});
