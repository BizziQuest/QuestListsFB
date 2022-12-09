<template>
  <div class="color-swatch">
  <v-menu
    v-model="colorPickerShown"
    :close-on-content-click="false"
    :close-on-click="false"
    location="start"
    transition="slide-x-transition"
  >
    <template #activator="{ props }">
      <div
        :style="swatchStyle"
        v-bind="props"
      />
    </template>
    <v-card>
      <v-card-text>
        <CustomColorPicker
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
        />
        <v-row align="center">
          <v-btn
            class="mx-auto mt-3"
            @click="closeSwatch"
          >
            Close
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
  </div>
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
    modelValue: {
      type: String,
      description: 'the value of the color, in hex',
    },
  },
  data() {
    return {
      colorPickerShown: false,
    };
  },
  computed: {
    swatchStyle() {
      return {
        backgroundColor: this.modelValue,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        border: '1px solid black',
        borderRadius: '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },

  },
  methods: {
    closeSwatch() {
      this.$emit('update:modelValue', this.modelValue);
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
