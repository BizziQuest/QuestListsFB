<template>
  <div>
    <list-metadata-preferences
      v-model="metadataPrefs"
      :compact="compact"
      class="pb-2"
    />
    <states-editor
      :state-group="list.stateGroup"
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
      deletedValues: [],
    };
  },
  computed: {
    ...mapState(['globalPreferences']),
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
    updateStateGroup(stateGroup) {
      this.metadataPrefs.newStateGroup = stateGroup;
    },
    updateListPreferences() {
      this.$emit('update:list', { ...this.metadataPrefs, deletedValues: this.deletedValues });
    },
  },
};
</script>

<style>
</style>