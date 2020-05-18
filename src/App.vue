<template>
  <div id="app">
    <v-app>
      <v-app>
        <top-menu-bar :drawer.sync="drawer"></top-menu-bar>
        <drawer-menu-bar :drawer="drawer"></drawer-menu-bar>
        <v-content>
          <v-container fluid class="grey lighten-4 fill-height">
            <v-row justify="center" align="center">
              <v-col class="shrink">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn :href="source" icon large target="_blank" v-on="on">
                      <v-icon large>mdi-code-tags</v-icon>
                    </v-btn>
                    <span style="color: red">{{drawer}}</span>
                  </template>
                  <span>Source</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-content>
      </v-app>
    </v-app>
  </div>
</template>

<script>
import TopMenuBarVue from "./components/TopMenuBar.vue";
import DrawerMenuVue from "./components/DrawerMenu";
export default {
  name: "App",

  components: {
    "top-menu-bar": TopMenuBarVue,
    "drawer-menu-bar": DrawerMenuVue
  },
  props: {
    source: String
  },
  data() {
    return {
      drawer: false,
      items: [
        { icon: "lightbulb_outline", text: "Notes" },
        { icon: "touch_app", text: "Reminders" },
        { divider: true },
        { heading: "Labels" },
        { icon: "add", text: "Create new label" },
        { divider: true },
        { icon: "archive", text: "Archive" },
        { icon: "delete", text: "Trash" },
        { divider: true },
        { icon: "settings", text: "Settings" },
        { icon: "chat_bubble", text: "Trash" },
        { icon: "help", text: "Help" },
        { icon: "phonelink", text: "App downloads" },
        { icon: "keyboard", text: "Keyboard shortcuts" }
      ]
    };
  },
  methods: {
   
  }
};
</script>
