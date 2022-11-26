<template>
  <v-snackbar
    v-if="messages[0]"
    v-model="showSnackbar"
    top
    shaped
    transition="fab-transition"
    :color="messages[0].type"
    :timeout="messages[0].timeout"
    @input="nextMessage"
  >
    {{ messages[0].text }}
    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="showSnackbar = false"
      >
        X
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data: () => ({
    showSnackbar: false,
    timeout: undefined,
  }),
  computed: {
    ...mapState({
      messages(state) {
        if (state.messages.length < 1) return [];
        this.showSnackbar = true;
        return state.messages;
      },
    }),
  },
  methods: {
    ...mapMutations(['setMessages']),
    //  Event to be Fired when Snackbar closes after timeout makes sense for @input
    nextMessage($evt) {
      if ($evt === false) {
        if (this.messages.length > 0) {
          this.$nextTick(() => {
            this.setMessages(this.messages.slice(1));
          });
        }
      }
    },
  },
};
</script>
<style scoped></style>
