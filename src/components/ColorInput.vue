<template>
  <v-text-field
    label="Color*"
    :value="value"
    @input="$emit('input', $event)"
    placeholder="#FFFFFF"
    :outlined="outline"
    test-color-input
  >
    <template v-slot:append>
      <color-swatch />
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
