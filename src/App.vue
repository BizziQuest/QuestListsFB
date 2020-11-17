<template>
  <v-app id="app" @keyup.ctrl.102="handleFind">
    <drawer-menu :drawer.sync="drawer"/>
    <v-main>
      <router-view></router-view>
    </v-main>
    <bottom-drawer-menu :drawer.sync="drawer"/>
  </v-app>
</template>

<script>
import DrawerMenu from './components/Menus/DrawerMenu.vue';
import BottomDrawerMenu from './components/Menus/BottomDrawerMenu.vue';

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
    };
  },
  components: {
    DrawerMenu,
    BottomDrawerMenu,
  },
  methods: {
    handleFind() {
      console.log('Showing Search Box...');
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

<style scoped>
/*.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}*/
</style>
