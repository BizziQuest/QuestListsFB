/* eslint-disable import/no-unresolved */
import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/store';
import VueRouter from 'vue-router';
import Lists from '@/views/Lists.vue';
import List from '@/views/List.vue';
import TopMenuBar from '@/components/Menus/TopMenuBar.vue';
// eslint-disable-next-line import/extensions
import routes from '@/router/routes.js';
import App from '@/App.vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

const localVue = createLocalVue();
const router = new VueRouter({ routes });
const vuetify = new Vuetify();
localVue.use(VueRouter, Vuetify, Vuex);
describe('Page Views', () => {
  it('render Lists component via routing', async () => {
    const wrapper = mount(App, {
      localVue,
      router,
      vuetify,
      store,
    });
    // wrapper.vm.$router.push('/');
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(TopMenuBar).exists()).toBe(true);
    expect(wrapper.findComponent(Lists).exists()).toBe(true);
  });
  it('renders a single List component via routing', async () => {
    const wrapper = mount(App, {
      localVue,
      router,
      vuetify,
      store,
    });
    // for correctness, we need to create a list in the store or mock the firebase lib to return waht we need
    wrapper.vm.$router.push('/lists/abc123');
    await wrapper.vm.$nextTick().catch((e) => console.log(e));
    expect(wrapper.findComponent(List).exists()).toBe(true);
  });
});
