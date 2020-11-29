<template>
  <div>
    <login-or-signup :dark='dark' v-if="!currentUser.uid" :toolbar="toolbar">
      <template v-slot:default="slotProps">
        <slot name="login" :on="slotProps.on"/>
      </template>
    </login-or-signup>
    <slot v-else name="avatar" :avatar="avatar" :username="currentUser.name" :userId="currentUser.uid">
      <v-list-item link title="User Management" to="/EditInfo">
        <v-list-item-avatar size="28">
          <v-img v-if="currentUser.avatar" :src="currentUser.avatar"/>
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-truncate">{{currentUser.displayName}}</v-list-item-title>
        </v-list-item-content>
        <v-icon icon small v-if="currentUser.uid" @click.stop.prevent="logoutAndGoHome">
          mdi-exit-to-app
        </v-icon>
      </v-list-item>
    </slot>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import LoginOrSignup from './LoginOrSignup.vue';

export default {
  name: 'UserMenuItem',
  components: {
    LoginOrSignup,
  },
  props: {
    dark: {
      description: 'sets the dark mode on this component.',
      default: false,
      type: Boolean,
    },
    toolbar: {
      description: 'Shows this as if it were in a toolbar instead of a list.',
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      avatar: false,
      userId: false,
      userName: 'Sign Up / Sign In',
    };
  },
  methods: {
    ...mapActions(['logOut']),
    logoutAndGoHome() {
      this.logOut();
      this.$router.push('/');
    },
  },
  computed: {
    ...mapState(['currentUser']),
  },
};
</script>

<style lang="css">
</style>
