<template>
  <div>
    <!-- <v-snackbar v-for="(message, i) in messages" :key="i" v-model="showSnackbar"
                top
                shaped
                :color='`${message.type}`'
                :timeout='`${message.timeout}`'
                @input="nextMessage"
              >
        {{ message.text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showSnackbar = false">
            X
          </v-btn>
        </template>
    </v-snackbar> -->
    <v-snackbar v-if="messages[0]" v-model="showSnackbar"
                top
                shaped
                :color="messages[0].type"
                :timeout="messages[0].timeout"
                @input="nextMessage"
              >
        {{ messages[0].text }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showSnackbar = false">
            X
          </v-btn>
        </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    showSnackbar: false,
    timeout: undefined,
  }),
  computed: {
    ...mapState({
      messages(state) {
        if (!state.messages.length > 0) return [];
        this.showSnackbar = true;
        // setTimeout(() => {}, this.message.timeout);
        // debugger;
        console.log(state.messages);
        return state.messages;
      },
    }),
  },
  methods: {
    nextMessage($evt) {
      console.log('message input changed: ', $evt);
      if ($evt === false) {
        // show next message
        this.setMessage(this.messages.unshift());
      }
    },
  },
};
</script>
<style scoped>
</style>
