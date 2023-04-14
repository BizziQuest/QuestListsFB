<template>
  <div class="user-menu-item">
    <login-or-signup
      v-if="!(currentUser && currentUser.uid)"
      :dark="dark"
      :toolbar="toolbar"
    >
      <template #default="slotProps">
        <slot
          name="login"
          :on="slotProps.on"
        />
      </template>
    </login-or-signup>
    <slot
      v-else
      name="avatar"
      :prepend-avatar="avatar"
      :username="currentUser.displayName"
      :user-id="currentUser && currentUser.uid"
    >
      <v-list-item
        link
        to="/profile"
        :prepend-avatar="avatar"
        :title="currentUser.displayName"
      >
        <template #prepend v-if="!avatar">
          <v-icon>mdi-account</v-icon>
        </template>
        <template #title="{title}" class="ml-3">
          {{ title }}
          <v-icon
            v-if="currentUser && currentUser.uid"
            small
            title="Logout"
            @click.stop.prevent="logoutAndGoHome"
          >
            mdi-exit-to-app
          </v-icon>
        </template>
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
      avatar: null,
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
