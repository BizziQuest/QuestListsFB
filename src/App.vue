<template>
  <v-app id="app" @keyup.ctrl.102="handleFind">
    <div id="nav">
        <drawer-menu :drawer.sync="drawer"/>
    </div>
    <v-main>
      <router-view></router-view>
    </v-main>
    <div id="nav">
        <bottom-drawer-menu :drawer.sync="drawer"/>
    </div>
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
};
</script>

<style scoped>
/*.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}*/
</style>
