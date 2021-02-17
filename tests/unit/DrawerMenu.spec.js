import DrawerMenu from '@/components/Menus/DrawerMenu.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
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
  const localStore = new Vuex.Store({
    state: {
      currentUser: {
        avatar: null,
        displayName: null,
        email: 'tersterson3@test.com',
        emailVerified: false,
        uid: 'UUID123456',
        useGravatar: false,
      },
    },
  });
  wrapper = mount(DrawerMenu, {
    localVue,
    router,
    vuetify,
    store: localStore,
  });
});

describe('Drawer Menu', () => {
  it('component include text Lists', () => {
    expect(wrapper.find('.font-weight-light').text()).toContain('Lists');
  });
});
