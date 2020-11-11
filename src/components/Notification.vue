<template>
  <v-snackbar v-model="showSnackbar" top :color='`${message.type}`'>
    {{ message.text }}
     <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="showSnackbar = false">
        X
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    showSnackbar: false,
  }),
  computed: {
    ...mapState({
      message(state) {
        if (!state.message || !state.message.text) return '';
        this.showSnackbar = true;
        return state.message;
      },
    }),
  },
};
</script>
<style scoped>
</style>
