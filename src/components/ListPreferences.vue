<template>
  <div>
    <list-metadata-preferences v-bind.sync="metadataPrefs"></list-metadata-preferences>
    <states-editor :stateGroup="globalPreferences.defaultStateGroup" @list:updated="updateStateGroup" />
    <v-btn color="blue" name="submit" elevation-13 test-submit-form @click="updateListPreferences">{{
      saveButtonText
    }}</v-btn>
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
  methods: {
    updateStateGroup(stateGroup) {
      this.metadataPrefs.stateGroup = stateGroup;
    },
    updateListPreferences() {
      this.$emit('update:list', this.metadataPrefs);
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
};
</script>

<style>
</style>
