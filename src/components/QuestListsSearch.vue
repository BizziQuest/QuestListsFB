<template>
  <v-container
    fluid
    class="lists-view"
  >
    <ais-instant-search
    :index-name="algoliaIndexName"
    :search-client="algolia">

    <ais-index :index-name="algoliaIndexName" />
<!-- <ais-autocomplete>
  <template v-slot="{ currentRefinement, indices, refine }">
    <input
      type="search"
      :value="currentRefinement"
      placeholder="Search for a product"
      @input="refine($event.currentTarget.value)"
    >
    <ul v-if="currentRefinement" v-for="index in indices" :key="index.indexId">
      <li>
        <h3>{{ index.indexName }}</h3>
        <ul>
          <li v-for="hit in index.hits" :key="hit.objectID">
            <ais-highlight attribute="title" :hit="hit"/>
          </li>
        </ul>
      </li>
    </ul>
  </template>
</ais-autocomplete> -->
    <ais-autocomplete>
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
            :value="currentRefinement"
            :items="getHits(indices)"
            :loading="isLoading"
            label="Search Quests"
            placeholder="Start typing to Search"
            prepend-inner-icon="questlists-search"
            @input="checkInput(refine, $event, indices, currentRefinement)"
            @keydown.enter="search"
          >
            <template v-slot:item="{ props, item }">
              <ais-highlight attribute="title" :hit="item"/>
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
    // searchTerm(val) {
    //   this.getSuggestions();
    // }
  },
  methods: {
    ...mapActions(['fetchLists']),
    ...mapMutations(['setLists']),
    getHits(indices) {
      const allHits = indices.reduce((res, idx) => res.concat(idx.hits), []);
      return allHits
    },
    checkInput(refine, $event, indices, currentRefinement) {
      this.searchTerm = $event.currentTarget.value;
      refine($event.currentTarget.value)
    },
    async search(e) {
      this.isLoading = true;
      this.$emit('search', this.searchTerm);
    },
    // async getSuggestions() {
    //   this.algoliaSuggestions = ['suggestions', this.searchTerm];
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
