<template>
  <span class="icon-state">
    <v-icon color="primary" dark @click.stop="dialog = true">{{ localIcon }}</v-icon>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Please choose your Icon?</v-card-title>
        <v-card-text>
          <v-row>
            Please enter the name of icon you wish to use for this state. You can get the icon names from
            <v-chip
              class="mr-2"
              @click="openMaterial"
            >
              <v-icon>mdi-vector-square</v-icon>
              Material
            </v-chip>
            <v-chip
              class="mr-2"
              rounded
              @click="openMaterialDesign">
                <!-- could not find a apporprite icon.-->
                Material desgin
            </v-chip>
          </v-row>
          <v-row>
            <div class="local-icon">
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
  props: ['icon'],
  data() {
    return {
      localIcon: this.icon,
      dialog: false,
      previousIcon: this.icon,
    };
  },
  methods: {
    chooseIcon() {
      this.$emit('update:icon', this.localIcon);
      this.previousIcon = this.localIcon;
      this.dialog = false;
    },
    close() {
      this.localIcon = this.previousIcon;
      this.dialog = false;
    },
    openMaterial() {
      window.open('https://material.io/resources/icons/', '_blank');
    },
    openMaterialDesign() {
      window.open('https://cdn.materialdesignicons.com/5.3.45/', '_blank');
    },
  },
};
</script>
<style lang='scss' scoped>
.local-icon {
  width: 28px;
  border: 1px solid green;
  margin: 5px;
  align-self: center;
}
</style>
