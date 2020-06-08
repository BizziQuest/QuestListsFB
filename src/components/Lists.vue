<template>
  <v-container fluid>
      <v-row no-gutters>
        <v-col v-if="lists.length < 1" col="12" md="12" class='mt-5'>
          <!--div style="color: red">Drawer: {{ drawer }}</div>
          <div style="color: red">User: {{ userInfo }}</div-->
          <v-alert icon="mdi-emoticon-sad" type="info">
            Please add some stuff
          </v-alert>
        </v-col>
        <v-col v-else v-for="list in lists" :key="list.bgColor" col="12" md="4">
            <v-card class=" mx-auto" min-height="200" max-width="350" tile :color="list.bgColor">
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

<style lang="css" scoped>

</style>
