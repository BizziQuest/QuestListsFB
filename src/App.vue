<template>
  <v-app id="app">
    <v-content>
      <top-menu-bar :drawer.sync="drawer"></top-menu-bar>
      <drawer-menu :drawer.sync="drawer"></drawer-menu>
      <lists></lists>
    </v-content>
  </v-app>
</template>

<script>
import TopMenuBar from './components/Menus/TopMenuBar.vue';
import DrawerMenu from './components/Menus/DrawerMenu.vue';
import Lists from './components/Lists.vue';

export default {
  name: 'App',

  components: {
    TopMenuBar,
    DrawerMenu,
    Lists,
  },
  props: {
    source: String,
  },
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped>
.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}
</style>
