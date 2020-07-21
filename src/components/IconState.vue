<template>
  <span class="icon-state">
    <v-icon color="primary" dark @click.stop="dialog = true">{{ item }}</v-icon>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Please choose your Icon?</v-card-title>
        <v-card-text>
          <v-row>
            Please enter the name of icon you wish to use for this state. You can get the icon names from
            https://material.io/resources/icons/ or https://cdn.materialdesignicons.com/5.3.45/.
          </v-row>
          <v-row>
            <v-icon>{{iconText}}</v-icon>
            <v-text-field v-model="iconText"></v-text-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Nah...</v-btn>
          <v-btn color="green darken-1" text @click="choose">Choose</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      iconText: this.item,
      dialog: false,
    };
  },
  methods: {
    choose() {
      this.$emit('myEvent', this.iconText);
    },
  },
};
</script>
