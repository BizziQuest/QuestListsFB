<template>
  <v-alert
    v-if="!currentUser.emailVerified"
    type="warning"
  >
    You need to be a verified user to {{ action }}. <br>
    Please {{userToBeEnrolled ? "sign up and" : ''}} verify your email and refresh this page.
    <slot />
  </v-alert>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    action: {
      default: 'continue',
      type: String,
      description: 'The action you want to perform.',
    },
  },
  computed: {
    ...mapState(['currentUser']),
    userToBeEnrolled() {
      return !this.currentUser.uid || this.currentUser.isAnonymous;
    },
  },
};
</script>
