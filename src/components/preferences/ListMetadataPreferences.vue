<template>
  <v-row :class="{ 'mt-0 mx-5': compact }">
    <v-col>
      <v-form ref="addTitleAndColorForm" v-model="formIsValid" @submit.prevent>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field label="List Title*" :rules="titleRules" :value="title"
              @input="updateAttribute('title', $event)" required placeholder="Your Title" :outlined="!compact"
              test-title-input :dense="compact"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Color" :rules="colorPickerRules" :value="color"
              @input="updateAttribute('color', $event)" placeholder="#FFFFFF" :outlined="!compact" test-color-input
              :dense="compact">
              <template v-slot:append>
                <v-menu :close-on-content-click="false" :close-on-click="false" v-model="colorPickerShown" left top>
                  <template v-slot:activator="{ on }">
                    <div :style="swatchStyle" class="color-picker-swatch" v-on="on" />
                  </template>
                  <v-card>
                    <v-card-text>
                      <CustomColorPicker :value="color" @input="updateAttribute('color', $event)" />
                      <v-row align="center">
                        <v-btn @click="colorPickerShown = false" class="mx-auto mt-3">Close</v-btn>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Description" :value="description" @input="updateAttribute('description', $event)"
              required placeholder="Describe your list purpose." :outlined="!compact" test-description-input
              :dense="compact">
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-row class="mt-0">
        <v-checkbox :value="adultContent" @change="updateAttribute('adultContent', $event || false)" test-adult-content
          class="mr-5 ml-3 mt-0" label="Adult Content" hide-details>
        </v-checkbox>
        <v-tooltip right max-width="200">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="ml-4 mt-0" color="info" dark v-bind="attrs" v-on="on">help</v-icon>
          </template>
          <span>Adult-oriented content is content which may include nudity, strong sexual themes, or strong descriptions
            of violence. Examples include QuestLists for Cyberpunk 2077 or Grand Theft Auto; Questlists
            of adult web sites or subreddits;
          </span>
        </v-tooltip>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import CustomColorPicker from '../CustomColorPicker.vue';

export default {
  components: {
    CustomColorPicker,
  },
  props: {
    adultContent: {
      description: 'Whether this list has adult content.',
      type: Boolean,
      default: false,
    },
    color: {
      description: 'The color of the list',
      type: String,
      default: null,
    },
    description: {
      description: 'A short description of the list.',
      type: String,
      default: null,
    },
    title: {
      description: 'A short description of the list.',
      type: String,
      default: null,
    },
    compact: {
      description: 'Whether to show a compact UI.',
      type: Boolean,
      default: false,
    },

  },
  data: () => ({
    titleRules: [
      (v) => !!v || 'Title is required',
      (v) => (v && v.length > 5) || 'Title must be longer than 5 characters',
    ],
    colorPickerRules: [
      (v) => !v || /^#([A-F0-9]{3}){1,2}$/i.test(v) || 'Color Format Must be #FFF or #FFFFFF, case-insensitive',
    ],
    colorPickerShown: false,
    formIsValid: false,
  }),
  methods: {
    updateAttribute(attributeName, newValue) {
      if (this.$refs.addTitleAndColorForm.validate()) {
        this.$emit(`update:${attributeName}`, newValue);
      }
    },
  },
  computed: {
    swatchStyle() {
      return {
        backgroundColor: this.color,
        cursor: 'pointer',
        height: this.compact ? '22px' : '30px',
        width: this.compact ? '22px' : '30px',
        borderRadius: '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
  },
};
</script>

<style>
.color-picker-swatch {
  border: #797979 1px solid;
}
</style>
