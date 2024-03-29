<template>
  <span class="icon-state">
    <v-icon
      :color="color"
      @click.stop="dialog = true"
    >{{ localIcon }}</v-icon>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">Please choose your Icon</v-card-title>
        <v-form
          ref="iconForm"
          @submit.prevent.stop="chooseIcon"
        >
          <v-card-text>
            <v-row>
              <div
                class="pa-5 mb-5 rounded-t-xl"
                color="info"
              >
                Select an icon to use. You can start typing to filter the results. At least 2 letters must be given.<br>
              </div>
            </v-row>
            <m-d-i-icon-chooser
              v-model="localIcon"
              @update:modelValue="localIcon = $event"
              test-icon-chooser></m-d-i-icon-chooser>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              text
              test-cancel-btn
              @click="close"
            >Nah</v-btn>
            <v-btn
              color="green darken-1"
              text
              test-choose-btn
              @click="chooseIcon"
            >Choose</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import MDIIconChooser from './MDIIconChooser.vue';

export default {
  components: {
    MDIIconChooser,
  },
  props: {
    icon: {
      type: String,
      description: 'The icon string',
    },
    color: {
      type: String,
      description: 'The hex color for this icon',
    },
  },
  data() {
    return {
      localIcon: this.icon,
      dialog: false,
      previousIcon: this.icon,
      iconNamingRules: [
        (v) => this.$_isIconNameNotEmpty(v) || 'icon name is required!',
        (v) => this.$_validateIconName(v) || 'Not a valid icon name',
      ],
    };
  },
  methods: {
    $_isIconNameNotEmpty(iconName) {
      if (!iconName) return false;
      if (iconName.trim() === '') return false;
      return true;
    },
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
<style scoped>
.local-icon {
  width: 28px;
  border: 1px solid green;
  margin: 5px;
  align-self: center;
}
</style>
