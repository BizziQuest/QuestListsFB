<template>
  <div>
    <login-or-signup-list-item :dark='dark' v-if="!currentUser.uid" :toolbar="toolbar">
      <template v-slot:default="slotProps">
        <slot name="login" :on="slotProps.on"/>
      </template>
    </login-or-signup-list-item>
    <slot v-else name="avatar" :avatar="avatar" :username="currentUser.name" :userId="currentUser.uid">
      <v-list-item link title="User Management">
        <v-list-item-avatar size="28">
          <v-img v-if="currentUser.avatar" :src="currentUser.avatar"/>
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <router-link class="text-truncate">{{currentUser.displayName}}</router-link>
        </v-list-item-content>
        <router-link tag="v-icon" icon small v-if="currentUser.uid" to="/EditInfo">
          mdi-exit-to-app
        </router-link>
      </v-list-item>
    </slot>
  </div>
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
    ...mapState(['currentUser']),
    //  ...mapState({
    //  currentUser({ currentUser }) {
    //    console.log('user: ', currentUser);
    //    if (currentUser.uid) {
    //      this.userId = currentUser.id;
    //      this.userName = currentUser.name;
    //      this.avatar = currentUser.avatar;
    //    }
    //  },
    //  }),
  },
};
</script>

<style lang="css">
</style>
