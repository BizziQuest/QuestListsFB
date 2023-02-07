<template>
  <v-container
    fluid
    class="lists-view"
  >
    <ais-instant-search
    :index-name="algoliaIndexName"
    :search-client="algolia">

    <!-- <ais-index :index-name="algoliaIndexName" /> -->
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
            @update:model-value="search($event, refine)"
          >
            <template v-slot:item="{ props, item, index }">
              <v-list-item v-bind="props" :title="null">
                <v-list-item-title>
                  <ais-highlight attribute="title" lines="one" :hit="item.value" :key="index"/>
                </v-list-item-title>
              </v-list-item>
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
  props: ['loading'],
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
    loading(val) {
      this.isLoading = val;
    }
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
      refine(this.searchTerm);
    },
    async search($event, refine) {
      if ($event?.title) this.searchTerm = $event.title;
      if (refine) refine(this.searchTerm);
      this.isLoading = true;
      this.$emit('search', this.searchTerm);
    },
  },
};
</script>
