<template>
  <div>
    <v-form ref="addTitleAndColorForm" v-model="formIsValid" @submit.prevent>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            label="List Title*"
            :rules="titleRules"
            :value="title"
            @change="title"
            required
            placeholder="Your Title"
            outlined
            test-title-input
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            label="Color"
            :rules="colorPickerRules"
            :value="listColor"
            placeholder="#FFFFFF"
            outlined
            test-color-input
          >
            <template v-slot:append>
              <v-menu :close-on-content-click="false" :close-on-click="false" v-model="colorPickerShown" left top>
                <template v-slot:activator="{ on }">
                  <div :style="swatchStyle()" class="color-picker-swatch" v-on="on" />
                </template>
                <v-card>
                  <v-card-text>
                    <CustomColorPicker :value="listColor" @input="updateListColor"/>
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
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            label="Description"
            :value="description"
            @input="this.$emit('update:description', $event)"
            required
            placeholder="Describe your list purpose."
            outlined
            test-description-input
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-checkbox
        :value="adultContent"
        @change="updateAdultContent"
        test-adult-content
        class="mx-5"
        label="Adult Content"
        hide-details
      >
      </v-checkbox>
      <v-tooltip right max-width="200">
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="ml-4 mt-3" color="info" dark v-bind="attrs" v-on="on">help</v-icon>
        </template>
        <span
          >Adult-oriented content is content which may include nudity, strong sexual themes, or strong descriptions of
          violence. Examples include QuestLists for Cyberpunk 2077 or Grand Theft Auto; Questlists of adult web sites or
          subreddits;
        </span>
      </v-tooltip>
    </v-row>
  </div>
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
    listColor: {
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
  }),
  methods: {
    updateAdultContent(newValue) {
      this.$emit('adultContentChanged', newValue);
    },
    updateListColor(newValue) {
      this.$emit('update:listColor', newValue);
    },
    swatchStyle() {
      return {
        backgroundColor: this.listColor,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
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
