<template>
  <v-card>
    <template #title>
      <span class="headline">Create A List</span>
    </template>
    <template #text>
        <user-auth-alert class="mb-3"/>
        <list-preferences
          save-button-text="Create"
          @update:list="createList"
        />
      <small>*indicates required field</small>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import UserAuthAlert from './UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import ListPreferences from './ListPreferences.vue';

export default {
  name: 'CreateList',
  components: {
    ListPreferences,
    UserAuthAlert,
  },
  mixins: [userAuthMixin],
  props: {
  },
  data() {
    return {
    };
  },
  methods: {
    ...mapActions(['createList']),
  },
};
</script>
