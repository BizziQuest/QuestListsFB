<template>
  <div>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="primary--text" text v-bind="attrs" v-on="on" v-on:click="logoutUser">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </template>
      <span>Log Out</span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  name: 'LogOut',
  methods: {
    logoutUser() {
      this.$store.dispatch('logOut');
    },
  },
};
</script>
