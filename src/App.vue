<template>
  <v-app
    id="app"
    @keyup.ctrl.f="handleFind"
  >
    <drawer-menu v-model:drawer="drawer" />
    <v-main :style="`max-width: 100%; background-color: ${pageBackgroundColor}`">
      <router-view v-slot="{ Component }" :key="$route.path">
        <transition name="router-anim" >
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <bottom-drawer-menu v-model:drawer="drawer" />
    <notification />
    <v-snackbar
      test-update-notification
      bottom
      :value="updateExists"
      :timeout="-1"
      color="primary"
    >
      An update is available
      <v-btn
        text
        @click="refreshApp"
      >
        Update
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import DrawerMenu from './components/Menus/DrawerMenu.vue';
import BottomDrawerMenu from './components/Menus/BottomDrawerMenu.vue';
import Notification from './components/GlobalNotification.vue';
import appUpdate from './mixins/appUpdate';
// import {
//   VApp, VButton, VMain
// } from 'vuetify';
export default {
  name: 'App',
  components: {
    DrawerMenu,
    BottomDrawerMenu,
    Notification,
    // VApp,VButton,VMain
  },
  mixins: [appUpdate],
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    ...mapState(['pageBackgroundColor']),
  },
  mounted() {
    this.$watch('$vuetify.display.name', (from, to) => {
      if (from !== 'sm' && to === 'sm') {
        this.drawer = false;
      }
    });
  },
  methods: {
    handleFind() {
      console.warn('Search Not Implemented');
    },
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
