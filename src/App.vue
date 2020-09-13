<template>
  <!-- id="keep" has no effect ? -->
  <v-app id="app" dark color="primary" class="primary">
    <!-- @updateDrawer="handleUpdate" -->
    <div id="nav">
        <top-menu-bar :drawer.sync="drawer" color="primary"></top-menu-bar>
        <drawer-menu-bar :drawer.sync="drawer" color="primary"></drawer-menu-bar>
    </div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TopMenuBarVue from './components/Menus/TopMenuBar.vue';
import DrawerMenuVue from './components/Menus/DrawerMenu.vue';

export default {
  name: 'App',

  components: {
    'top-menu-bar': TopMenuBarVue,
    'drawer-menu-bar': DrawerMenuVue,
  },
  data() {
    return {
      drawer: false,
      items: [
        { icon: 'lightbulb_outline', text: 'Notes' },
        { icon: 'touch_app', text: 'Reminders' },
        { divider: true },
        { heading: 'Labels' },
        { icon: 'add', text: 'Create new label' },
        { divider: true },
        { icon: 'archive', text: 'Archive' },
        { icon: 'delete', text: 'Trash' },
        { divider: true },
        { icon: 'settings', text: 'Settings' },
        { icon: 'chat_bubble', text: 'Trash' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Keyboard shortcuts' },
      ],
    };
  },
};
</script>

<style scoped>
/*.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}*/
</style>
