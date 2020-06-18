<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col v-if="lists.length < 1" col="12" md="12">
        <!--div style="color: red">Drawer: {{ drawer }}</div>
          <div style="color: red">User: {{ userInfo }}</div-->
        <v-alert icon="mdi-emoticon-sad" type="info">
          Please add some stuff
        </v-alert>
      </v-col>
      <v-col v-else v-for="(list, idx) in lists" :key="list.title" :cols="idx === 0 ? 12 : 6">
        <v-card
          min-height="200"
          :color="list.bgColor"
          style="margin-bottom: 20px; margin-right: 5px; border-radius: 25px;"
        >
          <v-row>
            <v-col cols="6">
              <!--v-avatar max-width="300000px" class="ml-1" :size="idx === 0 ? '400px' : '200px'"  tile -->
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                style=""
                :style="idx === 0 ? 'max-width:450px' : 'max-width:425px'"
              ></v-img>
            </v-col>
            <v-col md="6">
              <v-row align="center">
                <v-col cols="12">
                  <v-card-text>
                    <span class="display-3">{{ list.title }}</span>
                    <div style="color: #4567ac;">Greyhound divisely hello coldly fonwderfully</div>
                  </v-card-text>
                </v-col>
              </v-row>
              <v-row>
                <v-list-item>
                  <v-list-item-content style="color: black;">
                    <v-card id="list" color="#37d7eb" shaped max-width="400">
                      <ul
                        v-for="item in [
                          { name: 'List Item 1', state: 'Done' },
                          { name: 'List Item 2', state: 'Not Done' },
                          { name: 'List Item 3', state: 'Running' },
                          { name: 'List Item 4', state: 'Hugging' },
                          { name: 'List Item 5', state: 'Walking' },
                          { name: 'List Item 6', state: 'Done' },
                          { name: 'List Item 7', state: 'Not Done' },
                          { name: 'List Item 8', state: 'Running' },
                          { name: 'List Item 9', state: 'Hugging' },
                          { name: 'List Item 10', state: 'Walking' }
                        ]"
                        :key="item.name"
                      >
                        <li>[{{ item.state }}] {{ item.name }}</li>
                      </ul>
                    </v-card>
                  </v-list-item-content>
                </v-list-item>
              </v-row>
              <v-row class="d-flex align-self-end ml-4">
                <v-col>
                  <v-card-actions>
                    <v-btn fab>
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn fab>
                      <v-icon> pageview </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
              <div></div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Lists',
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
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
}

#list {
  height: 150px;
  overflow: auto;
}
.v-responsive__content {
    margin-left: 2px;
    height: 514px;
}
.v-image{
  margin-left: 10px;
  border-radius: 25px;
  margin-left: 5px;
  height: 100%;
}
</style>
