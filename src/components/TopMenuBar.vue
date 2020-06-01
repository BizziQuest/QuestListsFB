<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon v-on:click="$emit('update:drawer', !drawer)"></v-app-bar-nav-icon>
    <span class="title ml-3 mr-5">
      Quest
      <span class="font-weight-light">Lists</span>
    </span>
    <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search"></v-text-field>
    <v-spacer></v-spacer>
    <span v-if="isUserUthenticated">
      <logout-btn></logout-btn>
    </span>
    <span v-else>
      <login-or-signup-btn></login-or-signup-btn>
    </span>
  </v-app-bar>
</template>
<script>
import LogInorSignUp from './LogInorSignUp.vue';
import LogOut from './LogOut.vue';

export default {
  name: 'TopMenuBar',
  props: ['drawer'],
  components: {
    'login-or-signup-btn': LogInorSignUp,
    'logout-btn': LogOut,
  },
  computed: {
    isUserUthenticated() {
      return this.$store.getters.user !== undefined && this.$store.getters.user !== null;
    },
    localDrawer: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.$emit('update:drawer', val);
      },
    },
  },
};
</script>
