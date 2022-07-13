<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Create A List</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <user-auth-alert />
          <list-preferences @update:list="createList" saveButtonText="Create"></list-preferences>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import UserAuthAlert from './UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import ListPreferences from './ListPreferences.vue';

export default {
  name: 'CreateList',
  mixins: [userAuthMixin],
  components: {
    ListPreferences,
    UserAuthAlert,
  },
  data() {
    return {
    };
  },
  props: {
  },
  methods: {
    ...mapActions(['createList']),
  },
};
</script>
<style lang="scss" scoped>
</style>
