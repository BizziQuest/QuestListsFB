import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Lists from '@/views/Lists.vue';
import TopMenuBar from '@/components/Menus/TopMenuBar.vue';
import routes from '@/router/routes';
import App from '@/App.vue';
import store from '@/store';
import vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(VueRouter, vuetify);

describe('App', () => {
  it('render List component via routing', async () => {
    const router = new VueRouter({ routes });
    const wrapper = mount(App, {
      localVue,
      router,
      store,
    });
    wrapper.vm.$router.push('/Lists');
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(TopMenuBar).exists()).toBe(true);
    expect(wrapper.findComponent(Lists).exists()).toBe(true);
  });
});
