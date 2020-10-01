<template>
  <v-app id="app" @keyup.ctrl.102="handleFind">
    <div id="nav">
        <drawer-menu/>
    </div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import DrawerMenu from './components/Menus/DrawerMenu.vue';

export default {
  name: 'App',

  components: {
    DrawerMenu,
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
