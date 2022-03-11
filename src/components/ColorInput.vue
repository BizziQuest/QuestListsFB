<template>
  <v-text-field
    label="Color"
    :value="value"
    @input="$emit('input', $event)"
    placeholder="enter color"
    :outlined="outline"
    :rules="colorPickerRules"
    test-color-input
  >
    <template v-slot:append>
      <color-swatch :value="value" @input="$emit('input', $event)" />
    </template>
  </v-text-field>
</template>
<script>
import ColorSwatch from './ColorSwatch.vue';

export default {
  name: 'ColorInput',
  components: {
    ColorSwatch,
  },
  data: () => ({
    colorPickerRules: [
      (v) => !v || /^#([A-F0-9]{3}){1,2}$/i.test(v) || 'Color Format Must be #FFF or #FFFFFF, case-insensitive',
    ],
  }),
  props: {
    outline: {
      type: Boolean,
      description: 'show the outline on the text field',
    },
    value: {
      type: String,
      description: 'value of the default color',
    },
  },
};
</script>
<style scoped>
.v-input input {
  max-width: 170px;
}
</style>
