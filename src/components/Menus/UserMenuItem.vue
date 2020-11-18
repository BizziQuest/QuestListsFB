<template>
  <login-or-signup-list-item :dark='dark' v-if="!userId" :toolbar="toolbar"/>
  <v-list-item v-else link title="User Management">
    <v-list-item-action>
      <img v-if="avatar" :src="avatar"/>
      <v-icon v-else>mdi-account</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>{{userName}}</v-list-item-title>
      <router-link tag="v-icon" v-if="userId" to="EditInfo">mdi-account-edit-outline</router-link>
      <v-icon v-if="userId">mdi-exit-to-app</v-icon>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapState } from 'vuex';
import LoginOrSignupListItem from './LoginOrSignupListItem.vue';

export default {
  name: 'UserMenuItem',
  components: {
    LoginOrSignupListItem,
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
  computed: {
    ...mapState({
      currentUser(user) {
        if (user) {
          this.userId = user.id;
          this.userName = user.name;
          this.avatar = user.avatar;
        }
      },
    }),
  },
};
</script>

<style lang="css">
</style>
