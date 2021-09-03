 <template>
  <div>
    <v-btn-toggle v-model="colorPickerState" dense multiple height="28px" class="mb-2">
      <v-btn test-inputs-btn title="HTML Hex Code" class="ml-2" icon small>
        <v-icon>mdi-form-textbox</v-icon>
      </v-btn>
      <v-btn test-sliders-btn title="Color Sliders" class="ml-2" icon small>
        <v-icon>mdi-gauge</v-icon>
      </v-btn>
      <v-btn test-canvas-btn title="Color Gradient" class="ml-2" icon small rounded>
        <v-icon>mdi-palette</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-color-picker
      :value="value"
      @input="$emit('input', $event)"
      :hide-inputs="!colorPickerState.includes(0)"
      :hide-canvas="!colorPickerState.includes(2)"
      :hide-sliders="!colorPickerState.includes(1)"
      mode="hexa"
      :swatches="swatches"
      show-swatches
    />
  </div>
</template>
<script>
export default {
  name: 'CustomColorPicker',
  props: ['value'],
  data() {
    return {
      colorPickerState: [],
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
