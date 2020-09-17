<template>
  <v-app id="app" color="primary" class="primary">
    <div id="nav">
        <!--<top-menu-bar :drawer.sync="drawer" color="primary"></top-menu-bar>-->
        <drawer-menu :drawer.sync="drawer" color="primary"></drawer-menu>
    </div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import TopMenuBar from './components/Menus/TopMenuBar.vue';
import DrawerMenu from './components/Menus/DrawerMenu.vue';

export default {
  name: 'App',

  components: {
    DrawerMenu,
    // 'top-menu-bar': TopMenuBarVue,
    // 'drawer-menu-bar': DrawerMenuVue,
  },
  data() {
    return {
      drawer: true,
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
