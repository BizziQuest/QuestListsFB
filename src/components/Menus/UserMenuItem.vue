<template>
  <div class="user-menu-item">
    <login-or-signup :dark='dark' v-if="!currentUser.uid" :toolbar="toolbar">
      <template v-slot:default="slotProps">
        <slot name="login" :on="slotProps.on"/>
      </template>
    </login-or-signup>
    <slot v-else name="avatar"
      :avatar="avatar"
      :username="currentUser.displayName"
      :userId="currentUser.uid"
    >
      <v-list-item link title="User Management" to="/EditInfo">
        <v-list-item-avatar size="28">
          <v-img v-if="avatar" :src="avatar"/>
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="ml-3">
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
import { getAvatarForUser } from '../../util';

export default {
  name: 'UserMenuItem',
  components: {
    LoginOrSignup,
  },
  data() {
    return {
      avatar: null,
    };
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
  methods: {
    ...mapActions(['logOut']),
    logoutAndGoHome() {
      this.logOut();
      this.$router.push('/');
    },
  },
  computed: {
    ...mapState({
      currentUser(state) {
        const user = state.currentUser;
        this.avatar = getAvatarForUser(user);
        return user;
      },
    }),
  },
};
</script>

<style lang="css">
</style>
