<template>
  <v-container
    fluid
    class="lists-view"
  >
    <search @search="search" :loading="isLoading"/>
    <transition-group
      tag="div"
      class="row"
      name="fade"
    >
      <!-- TODO: when vuetify adds the skeleton loader back in to v3
      <v-col
        v-if="lists === null"
        key="skeleton"
        class="mt-5"
      >
        <v-skeleton-loader
          v-for="i in 6"
          :key="i"
          class="mx-auto"
          max-width="800"
          type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
        />
      </v-col> -->
      <v-row v-if="lists && lists.length < 1"
        key="sad"
        class="ml-5 mr-5 mt-10"
      >
        <v-alert
          prominent
          icon="$questlists-plus"
          type="info"
          class="col-12"
        >
          Welcome to Quest Lists! You don't have any Quests yet, but have no fear, simply click on the
          <v-icon class="mx-2">$questlists-plus</v-icon> icon on the left to get started!
        </v-alert>
      </v-row>
      <v-row>
        <v-col v-for="list in lists"
          :key="list.objectID || list.id"
          md="4"
          sm="6"
          cols="12"
        >
          <ListCard :list="list" />
        </v-col>
      </v-row>
    </transition-group>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { algoliaIndex } from '../algolia';
import ListCard from '../components/ListCard.vue';
import Search from '../components/QuestListsSearch.vue';
import { fetchQuestLists } from '../firebase';

export default {
  name: 'QuestLists',
  components: {
    ListCard,
    Search,
  },
  data: () => ({
    algoliaSuggestions: [],
    searchTerm: '',
    isLoading: false,
    searchTerm: '',
  }),
  watch: {
    searchTerm(val) {
      this.getSuggestions();
    }
  },
  methods: {
    ...mapActions(['fetchLists']),
    ...mapMutations(['setLists']),
    async search(term) {
      console.log('searching for', term)
      if (term === '') {
        this.setLists(this.fetchLists());
        return;
      }
      this.isLoading = true;
      const { hits } = await algoliaIndex.search(term);
      const slugs = hits.map((hit) => hit.slug);
      fetchQuestLists({
        slugs,
        callback: (lists) => {
          this.isLoading = false;
          this.setLists(lists);
        },
      });
    },
    async getSuggestions() {
      this.algoliaSuggestions = ['suggestions', this.searchTerm];
    },
  },
  computed: {
    ...mapState(['lists']),
  },
  mounted() {
    this.fetchLists();
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
}
ul li {
  line-height: 30px;
}
.list {
  height: 99px;
  overflow: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
:deep(.lists-view .search-box .v-label) {
  margin-left: 10px;
}
</style>
