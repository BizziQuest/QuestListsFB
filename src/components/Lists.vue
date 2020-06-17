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
          style="margin-bottom: 20px; margin-right: 5px; border-radius: 25px; "
        >
          <v-row>
            <v-col md="6">
              <v-avatar class="ml-1" size="200px" tile>
                <v-img src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                       style="border-radius: 25px;"></v-img> </v-avatar
            ></v-col>
            <v-col>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Title: {{ list.title }}</v-list-item-title>
                  <ul v-for="item in [
                    { name: 'List Item 1', state: 'Done' },
                    { name: 'List Item 2', state: 'Not Done'}]" :key="item.name">
                    <li>Name: {{ item.name }} | Status: {{ item.state }}</li>
                  </ul>
                </v-list-item-content>
              </v-list-item>
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

<style lang="scss" scoped></style>
