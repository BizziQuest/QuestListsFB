<template>
  <div>
    <v-tooltip
      left
      test-logout-tooltip
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="primary--text"
          text
          test-logout-button
          v-bind="attrs"
          v-on="on"
          @click="logoutUser"
        >
          <v-icon color="secondary">
            exit_to_app
          </v-icon>
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
