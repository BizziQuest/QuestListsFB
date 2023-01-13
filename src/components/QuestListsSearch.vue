<template>
  <v-container
    fluid
    class="lists-view"
  >
  <ais-instant-search
  :index-name="algoliaSuggestionIndexName"
  :search-client="algolia">
    <ais-autocomplete
  :escape-html="true"
  :class-names="{}">
  <template v-slot="{ currentRefinement, indices, refine }">
   <v-autocomplete
      class="search-box"
      solo
      filled
      rounded
      clearable
      hide-no-data
      hide-selected
      return-object
      :items="indices[0].hits"
      :loading="isLoading"
      color="white"
      :height="19"
      item-text="Search for"
      item-value="API"
      label="Search Quests"
      placeholder="Start typing to Search"
      prepend-inner-icon="questlists-search"
      @input="checkInput(refine, $event, indices, currentRefinement)"
      @keydown.enter="search"
    >
    <template v-slot:item="{ props, item }">
      <ais-highlight attribute="name" :hit="item"/>
    </template>
    </v-autocomplete>
    </template>
    </ais-autocomplete>
    </ais-instant-search>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { algolia, algoliaIndexName, algoliaSuggestionIndexName } from '../algolia';
import ListCard from './ListCard.vue';

export default {
  name: 'Questlists Search',
  components: {
    ListCard,
  },
  data: () => ({
    algoliaSuggestions: [],
    searchTerm: '',
    isLoading: false,
    searchTerm: '',
    algolia,
    algoliaIndexName,
    algoliaSuggestionIndexName
  }),
  watch: {
    searchTerm(val) {
      this.getSuggestions();
    }
  },
  methods: {
    ...mapActions(['fetchLists']),
    ...mapMutations(['setLists']),
    checkInput(refine, $event, indices, currentRefinement) {
      console.log(arguments, indices)
      this.searchTerm = $event.currentTarget.value;
      refine($event.currentTarget.value)
    },
    async search(e) {
      this.isLoading = true;
      this.$emit('search', this.searchTerm);
    },
    async getSuggestions() {
      this.algoliaSuggestions = ['suggestions', this.searchTerm];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
