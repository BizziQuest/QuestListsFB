<template>
  <span>
  <v-text-field
    label="Color"
    :model-value="modelValue"
    placeholder="enter color"
    :outlined="outline"
    :rules="colorPickerRules"
    test-color-input
    @update:modelValue="updateValue"
  >
    <template #append>
      <color-swatch
        :modelValue="modelValue"
        @update:modelValue="updateValue"
      />
    </template>
  </v-text-field>
  </span>
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
    modelValue: {
      type: String,
      description: 'value of the default color',
    },
  },
  data: () => ({
    colorPickerRules: [
      (v) => !v || /^#([A-F0-9]{3}){1,2}$/i.test(v) || 'Color Format Must be #FFF or #FFFFFF, case-insensitive',
    ],
  }),
  methods: {
    updateValue(newValue) {
      console.debug('Updating:', newValue);
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>
<style scoped>
.v-input input {
  max-width: 170px;
}
</style>
