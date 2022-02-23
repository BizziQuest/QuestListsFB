<template>
  <v-menu :close-on-content-click="false" :close-on-click="false" v-model="colorPickerShown" left top>
    <template v-slot:activator="{ on }">
      <div :style="swatchStyle()" v-on="on" />
    </template>
    <v-card>
      <v-card-text>
        <CustomColorPicker :value="value" @input="$emit('input', $event)" />
        <v-row align="center">
          <v-btn @click="closeSwatch" class="mx-auto mt-3">Close</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script>
import CustomColorPicker from './CustomColorPicker.vue';

export default {
  name: 'ColorSwatch',
  components: {
    CustomColorPicker,
  },
  props: {
    outline: {
      type: Boolean,
      description: 'show the outline on the text field',
      required: false,
    },
    value: {
      type: String,
      description: 'the value of the color, in hex',
      // default: '#000000',
    },
  },
  data() {
    return {
      colorPickerShown: false,
    };
  },
  methods: {
    swatchStyle() {
      return {
        backgroundColor: this.value,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        border: '1px solid black',
        borderRadius: '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
    closeSwatch() {
      this.$emit('input', this.value);
      this.colorPickerShown = false;
    },
  },
};
</script>
<style scoped>
.v-input input {
  max-width: 170px;
}
</style>
