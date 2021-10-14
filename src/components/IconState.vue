<template>
  <span class="icon-state">
    <v-icon color="primary" @click.stop="dialog = true">{{ localIcon }}</v-icon>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Please choose your Icon</v-card-title>
        <v-form ref="iconForm">
          <v-card-text>
            <v-row>
              <div class="pa-5 mb-5 rounded-t-xl" color="info">
                Please enter the name of icon you wish to use for this state. You can get the icon names from the
                following sites.<br />
                <v-chip class="mr-2" @click="openMaterial">
                  <v-icon class="mr-2">mdi-vector-square</v-icon>
                  Material
                </v-chip>
                <v-chip class="mr-2" rounded @click="openMaterialDesign">
                  <v-icon class="mr-2">mdi-material-design</v-icon>
                  Material desgin
                </v-chip>
              </div>
            </v-row>
            <v-row>
              <div class="local-icon">
                <v-icon ref="icon" test-icon> {{ localIcon }} </v-icon>
              </div>
              <v-text-field v-model="localIcon"
              :rules="iconNamingRules" ref="iconInput" test-icon-input required></v-text-field>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="close">Nah...</v-btn>
            <v-btn color="green darken-1" text @click="chooseIcon">Choose</v-btn>
          </v-card-actions>
        </v-form>
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
      iconNamingRules: [
        (v) => !!v || 'icon name is required!',
        (v) => this.$_validateIconName(v) || 'Not a valid icon name',
      ],
    };
  },
  methods: {
    $_validateIconName() {
      const selectedIcon = this.$refs.icon.$el;
      if (!selectedIcon) return true;
      const styleContentValue = window.getComputedStyle(selectedIcon, '::before').getPropertyValue('content');
      return styleContentValue !== '' && styleContentValue !== 'none';
    },
    chooseIcon() {
      if (this.$refs.iconForm.validate() === false) return;
      this.$emit('update:icon', this.localIcon);
      this.previousIcon = this.localIcon;
      this.dialog = false;
    },
    close() {
      if (this.$refs.iconForm.validate() === false) return;
      this.localIcon = this.previousIcon;
      this.dialog = false;
    },
    openMaterial() {
      window.open('https://material.io/resources/icons/', '_blank');
    },
    openMaterialDesign() {
      window.open('https://materialdesignicons.com/', '_blank');
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
