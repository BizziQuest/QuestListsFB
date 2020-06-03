<template>
  <!-- id="keep" has no effect ? -->
  <v-app>
    <!-- @updateDrawer="handleUpdate" -->
    <top-menu-bar :drawer.sync="drawer"></top-menu-bar>
    <drawer-menu-bar :drawer.sync="drawer"></drawer-menu-bar>
    <v-container fluid class="grey lighten-4  fill-height">
      <v-row>
        <v-col v-if="lists.length < 1" col="12" md="12">
          <!--div style="color: red">Drawer: {{ drawer }}</div>
          <div style="color: red">User: {{ userInfo }}</div-->
          <v-alert icon="mdi-emoticon-sad" type="info">
            Please add some stuff
          </v-alert>
        </v-col>
        <v-col v-else v-for="list in lists" :key="list.bgColor" col="12" md="4">
            <v-card class=" mx-auto" min-height="250" max-width="350" tile :color="list.bgColor">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Title: {{ list.title }}</v-list-item-title>
                  <ul v-for="item in list.items" :key="item.name">
                    <li>Name: {{ item.name }} | Status: {{ item.state }}</li>
                  </ul>
                </v-list-item-content>
              </v-list-item>
            </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
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
      return this.$store.getters.user !== undefined && this.$store.getters.user !== null;
    },
    lists() {
      // if this.authenticated?
      if (this.isUserUthenticated) {
        return this.$store.getters.lists;
      }
      return [];
    },
  },
  methods: {
    // handleUpdate(val) {
    //   console.log('UPDATE', val);
    //   this.drawer = val;
    // },
  },
};
</script>
