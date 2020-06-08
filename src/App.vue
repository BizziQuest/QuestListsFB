<template>
  <!-- id="keep" has no effect ? -->
  <v-app id="app">
    <!-- @updateDrawer="handleUpdate" -->
    <v-content>
      <top-menu-bar :drawer.sync="drawer"></top-menu-bar>
      <drawer-menu-bar :drawer.sync="drawer"></drawer-menu-bar>
      <Lists></Lists>
    </v-content>
  </v-app>
</template>

<script>
import TopMenuBarVue from './components/TopMenuBar.vue';
import DrawerMenuVue from './components/DrawerMenu.vue';
import Lists from './components/Lists.vue';

export default {
  name: 'App',

  components: {
    'top-menu-bar': TopMenuBarVue,
    'drawer-menu-bar': DrawerMenuVue,
    Lists,
  },
  props: {
    source: String,
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
.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}
</style>
