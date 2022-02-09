<template>
  <v-menu :close-on-content-click="false" :close-on-click="false" v-model="colorPickerShown" left top>
    <template v-slot:activator="{ on }">
      <div :style="swatchStyle()" v-on="on" />
    </template>
    <v-card>
      <v-card-text>
        <CustomColorPicker v-model="listColor" />
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
    },
  },
  data() {
    return {
      listColor: '',
      colorPickerShown: false,
    };
  },
  methods: {
    swatchStyle() {
      return {
        backgroundColor: this.listColor,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        border: '1px solid black',
        borderRadius: '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
    closeSwatch() {
      this.$emit('colorChange', this.listColor);
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
