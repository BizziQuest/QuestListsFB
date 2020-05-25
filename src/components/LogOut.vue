<template>
  <div>
    <v-btn outlined class="primary z-depth-0 darken" @click="logoutUser">Log out</v-btn>
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
