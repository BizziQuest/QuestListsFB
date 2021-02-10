/* eslint-disable import/no-unresolved */
import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store';
import VueRouter from 'vue-router';
import Lists from '@/views/Lists.vue';
import List from '@/views/List.vue';
import TopMenuBar from '@/components/Menus/TopMenuBar.vue';
import EditInfo from '@/components/EditInfo.vue';
import routes from '@/router/routes';
import App from '@/App.vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);

let wrapper = null;

beforeEach(() => {
  wrapper = mount(App, {
    localVue,
    router,
    vuetify,
    store,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('Page Views', () => {
  it('render Lists component via routing', async () => {
    wrapper.vm.$nextTick();
    expect(wrapper.findComponent(TopMenuBar).exists()).toBe(true);
    expect(wrapper.findComponent(Lists).exists()).toBe(true);
  });
  it('renders a single List component via routing', async (done) => {
    // since we are testing for the presence of a component, we only need to check if that component renders
    wrapper.vm.$router.push('/lists/abc123');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.findComponent(List).exists()).toBe(true);
      done();
    });
  });
  it('renders the profile component via routing', async (done) => {
    wrapper.vm.$router.push('/editinfo');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.findComponent(EditInfo).exists()).toBe(true);
      done();
    });
  });
  it.todo('should not allow anonymous users to visit the edit user page.');
});
