<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="keep">
        <top-menu-bar :drawer.sync="drawer" @updateDrawer="handleUpdate"></top-menu-bar>
        <drawer-menu-bar :drawer.sync="drawer"></drawer-menu-bar>
        <v-content>
          <v-container fluid class="grey lighten-4 fill-height">
            <v-row justify="center" align="center">
              <v-col class="shrink">
                <div style="color: red">Drawer: {{ drawer }}</div>
                <div style="color: red">User: {{ userInfo }}</div>
                <div v-show="isUserUthenticated">
                  <v-card class="mx-auto" max-width="400" tile>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Single-line item</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title>Two-line item</v-list-item-title>
                        <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-content>
      </v-app>
    </v-app>
  </div>
</template>

<script>
import TopMenuBarVue from './components/TopMenuBar.vue';
import DrawerMenuVue from './components/DrawerMenu.vue';

export default {
  name: 'App',

  components: {
    'top-menu-bar': TopMenuBarVue,
    'drawer-menu-bar': DrawerMenuVue,
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
  computed: {
    userInfo() {
      return this.$store.getters.user;
    },
    isUserUthenticated() {
      return (
        this.$store.getters.user !== undefined
        && this.$store.getters.user !== null
      );
    },
  },
  methods: {
    handleUpdate(val) {
      console.log('UPDATE', val);
      this.drawer = val;
    },
  },
};
</script>
