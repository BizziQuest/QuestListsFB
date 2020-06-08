<template>
  <v-app-bar app clipped-left style="height: 69px">
    <v-app-bar-nav-icon  v-on:click="$emit('update:drawer', !drawer)"></v-app-bar-nav-icon>
    <span class="title ml-3 mr-5">
      Quest
      <span class="font-weight-light">Lists</span>
    </span>
    <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search"></v-text-field>
    <v-spacer></v-spacer>
    <span v-if="isUserUthenticated">
      <v-avatar
          avatarStyle='Circle'
          class="profile"
          color="grey"
          size="70"
          >
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
          </v-avatar>
    </span>
    <span v-else>
      <login-or-signup-btn></login-or-signup-btn>
    </span>
  </v-app-bar>
</template>
<script>
import LogInorSignUp from '../LogInorSignUp.vue';
// import LogOut from '../LogOut.vue';

export default {
  name: 'TopMenuBar',
  props: ['drawer'],
  components: {
    'login-or-signup-btn': LogInorSignUp,
    // 'logout-btn': LogOut,
  },
  computed: {
    isUserUthenticated() {
      return this.$store.getters.user !== undefined && this.$store.getters.user !== null;
    },
  },
};
</script>
<style lang="css" scoped>
 .v-toolbar__content{
   height: 69px !important;
 }
</style>
