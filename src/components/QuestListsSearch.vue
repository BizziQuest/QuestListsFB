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
      @input="checkInput(refine, $event)"
      @keydown.enter="search"
    /></template>
    </ais-autocomplete>
    </ais-instant-search>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { algolia, algoliaSuggestionIndexName } from '../algolia';
import { fetchQuestLists } from '../firebase';
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
    algoliaSuggestionIndexName,
  }),
  watch: {
    searchTerm(val) {
      this.getSuggestions();
    }
  },
  methods: {
    ...mapActions(['fetchLists']),
    ...mapMutations(['setLists']),
    checkInput(refine, $event) {
      refine($event.currentTarget.value)
    },
    async search(e) {
      if (e.target.value === '') {
        this.setLists(this.fetchLists());
        return;
      }
      this.isLoading = true;
      // TODO: emit an event for updating the search query and move this function up
      const { hits } = await algoliaIndex.search(this.searchTerm);
      const resultsSlugs = hits.map((hit) => hit.slug);
      fetchQuestLists({
        slugs: resultsSlugs,
        callback: (lists) => {
          this.setLists(lists);
          this.isLoading = false;
        },
      });
    },
    async getSuggestions() {
      this.algoliaSuggestions = ['suggestions', this.searchTerm];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
