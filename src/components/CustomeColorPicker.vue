<template>
  <div>
    <v-color-picker flat :value="value" @input="$emit('input', $event)"
     :hide-canvas="isCanvas"
     :hide-sliders="isSliders"
     :swatches="swatches"
     show-swatches/>
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
      swatches: [
        ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'],
      ],
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
