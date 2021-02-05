<template>
  <v-alert v-if="!currentUser.emailVerified" type="warning">
    You need to be a verified user to {{ action }}. <br/>
    Please sign up and verify your email.
    <slot>
    </slot>
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
  },
};
</script>
