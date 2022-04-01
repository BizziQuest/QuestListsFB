<template>
  <div>
    <list-metadata-preferences v-bind.sync="metadataPrefs"></list-metadata-preferences>
    <states-editor :stateGroup="globalPreferences.defaultStateGroup" @list:updated="listUpdated" />
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
  listColor: '',
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
        listColor: this.list.listColor,
      },
      adultContent: false,
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
        listColor: newValue.listColor,
      };
    },
  },
  methods: {
    listUpdated(listItems) {
      this.updatedListStatesItems = listItems;
    },
    updateListPreferences() {
      this.$emit('update:list', this.metadataPrefs);
    },
  },
  mounted() {
    this.metadataPrefs = {
      title: this.list.title,
      description: this.list.description,
      listColor: this.list.listColor,
    };
  },
};
</script>

<style>
</style>
