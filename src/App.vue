<template>
  <v-app>
    <p> {{message}} </p>
    <v-btn class="primary" v-on:click="messageIs()"> what is message? </v-btn>
    <v-alert
      :value = "messageValue"
      type = "success"
    >
      This is a success alert.
    </v-alert>
  </v-app>
</template>


<script>

export default {
  components: {},
  data() {
    return {
      messageValue: false,
      message: 'Vuetify is here',
    };
  },
  methods: {
    messageIs() {
      this.messageValue = !this.messageValue;
    },
  },
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
