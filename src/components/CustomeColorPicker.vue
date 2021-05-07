<template>
  <div>
    <v-color-picker flat :value="value" @input="$emit('input', $event)"
     :hide-canvas="isCanvas"
     :hide-sliders="isSliders"/>
    <v-checkbox
    label= "Canvas"
    v-model="havingCanvas"
    @click.stop=""></v-checkbox>
    <v-checkbox
    label="Sliders"
    v-model="havingSliders"
    @click.stop=""></v-checkbox>
  </div>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      isCanvas: true,
      isSliders: true,
    };
  },
  computed: {
    havingCanvas: {
      get() {
        return !this.isCanvas;
      },
      set(newValue) {
        this.isCanvas = !newValue;
      },
    },
    havingSliders: {
      get() {
        return !this.isSliders;
      },
      set(newValue) {
        this.isSliders = !newValue;
      },
    },
  },
};
</script>
