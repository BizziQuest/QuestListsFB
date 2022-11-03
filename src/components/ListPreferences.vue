<template>
  <div>
    <v-form
        ref="listPreferencesForm"
        v-model="formIsValid"
        @submit.prevent
      >
    <list-metadata-preferences
      v-bind="metadataPrefs"
      :compact="compact"
      @update:prop="updateProperty"
      @valid="formIsValid = $event"
      class="pb-2"
    />
    <states-editor
      :state-group="states"
      :compact="compact"
      @list:updated="updateStateGroup"
    />

    <v-btn
      color="blue"
      name="submit"
      elevation-13
      test-submit-form
      @click="updateListPreferences"
    >
      {{
        saveButtonText
      }}
    </v-btn>
  </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ListMetadataPreferences from './preferences/ListMetadataPreferences.vue';
import StatesEditor from './StatesEditor.vue';

const defaultFormData = {
  title: '',
  newState: '',
  newItem: '',
  statesPicked: '',
  updatedListStatesItems: [],
  description: '',
  color: '',
  adultContent: false,
};

export default {
  components: { ListMetadataPreferences, StatesEditor },
  props: {
    list: {
      type: Object,
      default: () => ({}),
      description: 'The list we are managing.',
    },
    saveButtonText: {
      type: String,
      default: 'Save',
      description: 'The text of the save button.',
    },
    compact: {
      description: 'Whether to show a compact UI.',
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ...defaultFormData,
      metadataPrefs: {
        title: this.list.title,
        description: this.list.description,
        color: this.list.color,
        adultContent: false,
      },
      newStateGroup: null,
      deletedValues: [],
      formIsValid: false,
    };
  },
  computed: {
    ...mapState(['globalPreferences']),
    states() {
      return this.newStateGroup || this.list.stateGroup;
    },
  },
  watch: {
    list(newValue) {
      this.metadataPrefs = {
        title: newValue.title,
        description: newValue.description,
        color: newValue.color,
        adultContent: newValue.adultContent,
      };
    },
  },
  mounted() {
    this.metadataPrefs = {
      title: this.list.title,
      description: this.list.description,
      color: this.list.color,
      adultContent: this.list.adultContent,
    };
  },
  methods: {
    updateProperty($event) {
      this.metadataPrefs[$event.name] = $event.value
    },
    updateStateGroup(stateGroup) {
      // NOTE: we are not using metadataPrefs
      // this.metadataPrefs.newStateGroup = stateGroup;
      this.newStateGroup = stateGroup;
    },
    updateListPreferences() {
      if (this.formIsValid) {
        this.$emit('update:list', { ...this.metadataPrefs, deletedValues: this.deletedValues });
      }
    },
  },
};
</script>

<style>
</style>
