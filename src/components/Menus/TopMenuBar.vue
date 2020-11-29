<template>
  <v-app-bar color="primary" dark app clipped-left style="height: 69px">
    <v-app-bar-nav-icon @click="$emit('update:drawer', !drawer)">
      <v-icon color="secondary">mdi-shield-check-outline</v-icon>
    </v-app-bar-nav-icon>
    <span class="title ml-3 mr-5 secondary--text" style="cursor: pointer" @click="goToHome">
      Quest
      <span class="font-weight-light">Lists</span>
    </span>
    <v-text-field
      clearable
      hide-details
      label="Search"
      prepend-icon="search"
    ></v-text-field>
    <v-spacer></v-spacer>
    <avatar-menu v-if="currentUser && currentUser.uid"></avatar-menu>
    <login-or-signup v-else></login-or-signup>
  </v-app-bar>
</template>
<script>
import { mapState } from 'vuex';
import LoginOrSignup from './LoginOrSignup.vue';
import AvatarMenu from './AvatarMenu.vue';

export default {
  name: 'TopMenuBar',
  props: ['drawer'],
  components: {
    LoginOrSignup,
    AvatarMenu,
  },
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    },
  },
};
</script>
<style lang="css" scoped>
</style>
