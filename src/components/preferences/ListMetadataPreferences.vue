<template>
  <v-row :class="{ 'mt-0 mx-5': compact }">
    <v-col>
      <v-form
        ref="addTitleAndColorForm"
        v-model="formIsValid"
        @submit.prevent
      >
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-text-field
              label="List Title*"
              :rules="titleRules"
              :model-value="title"
              required
              placeholder="Your Title"
              :outlined="!compact"
              test-title-input
              :dense="compact"
              @update:model-value="updateAttribute('title', $event)"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
          <ColorInput v-model="color" />
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col
            cols="12"
            sm="12"
            md="12"
          >
            <v-text-field
              label="Description"
              :model-value="description"
              required
              placeholder="Describe your list purpose."
              :outlined="!compact"
              test-description-input
              :dense="compact"
              @update:model-value="updateAttribute('description', $event)"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-row class="mt-0">
        <v-checkbox
          :model-value="adultContent"
          test-adult-content
          class="mr-5 ml-3 mt-0"
          label="Adult Content"
          hide-details
          @update:model-value="updateAttribute('adultContent', $event || false)"
        />
        <v-tooltip
          right
          max-width="200"
        >
          <template #activator="{ props, attrs }">
            <v-icon
              class="ml-4 mt-0"
              color="info"
              dark
              v-bind="props"
            >
              help
            </v-icon>
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
import ColorInput from '../ColorInput.vue';
export default {
  components: {
    CustomColorPicker,
    ColorInput
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
      default: '',
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
  methods: {
    updateAttribute(attributeName, newValue) {
      if (this.$refs.addTitleAndColorForm.validate()) {
        this.$emit('update:prop', {name: attributeName, value: newValue});
      }
    },
  },
};
</script>

<style>
.color-picker-swatch {
  border: #797979 1px solid;
}
</style>
