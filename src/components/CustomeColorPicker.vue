<template>
  <div>
    <v-toolbar flat small dense height="28px" class="mb-2">
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          title="HTML Hex Code"
          :input-value="!hideInputs"
          active-class="active"
          class="ml-2"
          icon
          small
          @click="hideInputs = !hideInputs"
          ><v-icon>mdi-form-textbox</v-icon></v-btn
        >
        <v-btn
          title="Color Sliders"
          :input-value="!hideSliders"
          active-class="active"
          class="ml-2"
          icon
          small
          @click="hideSliders = !hideSliders"
          ><v-icon>mdi-gauge</v-icon></v-btn
        >
        <v-btn
          title="Color Gradient"
          :input-value="!hideCanvas"
          active-class="active"
          class="ml-2"
          icon
          small
          rounded
          @click="hideCanvas = !hideCanvas"
          ><v-icon>mdi-palette</v-icon></v-btn
        >
      </v-toolbar-items>
    </v-toolbar>
    <v-color-picker
      :value="value"
      @input="$emit('input', $event)"
      :hide-inputs="hideInputs"
      :hide-canvas="hideCanvas"
      :hide-sliders="hideSliders"
      mode="hexa"
      :swatches="swatches"
      show-swatches
    />
  </div>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      hideCanvas: true,
      hideSliders: true,
      hideInputs: true,
      swatches: [
        ['#363636', '#F9AA33', '#9b6c41', '#e5a986', '#4690b5'],
        ['#308577', '#abcdef', '#e1b2c6', '#f34f4e', '#9aa1bc'],
        ['#9868b5', '#d6513f', '#1f2028', '#f234ab', '#a29e51'],
      ],
    };
  },
};
</script>

<style scoped>
.active {
  background-color: #cad2f8;
}
</style>
