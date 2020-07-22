<template>
  <span class="icon-state">
    <v-icon color="primary" dark @click.stop="dialog = true">{{ localIcon }}</v-icon>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Please choose your Icon?</v-card-title>
        <v-card-text>
          <v-row>
            Please enter the name of icon you wish to use for this state. You can get the icon names from
            https://material.io/resources/icons/ or https://cdn.materialdesignicons.com/5.3.45/.
          </v-row>
          <v-row>
            <div id="local-icon">
              <v-icon>{{localIcon}}</v-icon>
            </div>
            <v-text-field v-model="localIcon"></v-text-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="close">Nah...</v-btn>
          <v-btn color="green darken-1" text @click="chooseIcon">Choose</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  props: ['passedIcon'],
  data() {
    return {
      localIcon: this.passedIcon,
      dialog: false,
    };
  },
  methods: {
    chooseIcon() {
      this.$emit('update:icon', this.localIcon);
      this.dialog = false;
    },
    close() {
      this.dialog = false;
      this.localIcon = this.passedIcon;
    },
  },
};
</script>
<style lang='scss' scoped>
#local-icon {
width: 28px;
    border: 1px solid green;
    margin: 5px;
    align-self: center;
}
</style>
