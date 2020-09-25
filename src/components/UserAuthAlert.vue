<template>
  <v-alert v-if="!currentUser.emailVerified" type="warning">
    You need to be a verified user to continue. <br/>
    Please sign up and verify your email.
  </v-alert>
</template>
<script>
// import userAuthMixin from '../mixins/UserAuth.vue';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['currentUser']),
  },
};
</script>
