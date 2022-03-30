<template>
  <div>
    <list-metadata-preferences
      v-bind.sync="metadataPrefs"
    ></list-metadata-preferences>
    <states-editor :stateGroup="globalPreferences.defaultStateGroup" @list:updated="listUpdated" />
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
  data: () => ({
    ...defaultFormData,
    metadataPrefs: {
      title: '',
      description: '',
      listColor: '',
    },
    adultContent: false,
  }),
  computed: {
    ...mapState(['globalPreferences']),
  },
  methods: {
    listUpdated(listItems) {
      this.updatedListStatesItems = listItems;
    },
  },
};
</script>

<style>
</style>
