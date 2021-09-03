<template>
  <v-app id="app" @keyup.ctrl.102="handleFind">
    <drawer-menu :drawer.sync="drawer" />
    <v-main>
      <transition  name="router-anim">
        <router-view :key="$route.path"></router-view>
      </transition>
    </v-main>
    <bottom-drawer-menu :drawer.sync="drawer" />
    <notification />
    <v-snackbar test-update-notification bottom :value="updateExists" :timeout="-1" color="primary">
      An update is available
      <v-btn text @click="refreshApp">
        Update
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import DrawerMenu from './components/Menus/DrawerMenu.vue';
import BottomDrawerMenu from './components/Menus/BottomDrawerMenu.vue';
import Notification from './components/Notification.vue';
import appUpdate from './mixins/appUpdate';

export default {
  name: 'App',
  components: {
    DrawerMenu,
    BottomDrawerMenu,
    Notification,
  },
  data() {
    return {
      drawer: false,
    };
  },
  mixins: [appUpdate],
  methods: {
    handleFind() {
      console.warn('Search Not Implemented');
    },
  },
  mounted() {
    this.$watch('$vuetify.breakpoint.name', (from, to) => {
      if (from !== 'sm' && to === 'sm') {
        this.drawer = false;
      }
    });
  },
};
</script>

<style>
/*.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}*/
.firebase-emulator-warning {
  display: none;
}

.router-anim-enter-active {
  transition: all 0.8s ease;
}
.router-anim-leave-active {
  transition: all 0.3s cubic-bezier(0.3, 0.5, 0.8, 1);
}
.router-anim-enter,
.router-anim-leave-to {
  position: absolute;
  top: 0px;
  transform: translateX(15px);
  opacity: 0;
}
</style>
