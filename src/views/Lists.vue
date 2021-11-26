<template>
  <v-container fluid class="lists-view">
    <transition-group tag="div" class="row" name="fade">
      <v-row style="position: absolute; width: 100%" key="loader" class="align-content-center" v-if="isLoading">
        <v-col v-for="i in 6" md="4" :key="i" class="d-flex align-stretch">
          <v-skeleton-loader
            class="mx-auto"
            style="max-height: 200px; width: 100%"
            type="card-heading,list-item-three-line"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-if="showNoListsInfo" key="sad" class="ml-5 mr-5 mt-10">
        <v-alert prominent icon="mdi-shield-plus-outline" type="info" class="col-12">
          Welcome to Quest Lists! You don't have any Quests yet, but have no fear, simply click on the
          <v-icon>mdi-shield-plus-outline</v-icon> icon on the left to get started!
        </v-alert>
      </v-row>
      <v-row style="position: absolute" key="content"  v-else>
        <v-col
          v-for="list in lists"
          :key="list.id"
          md="4"
          sm="6"
          class="d-flex align-stretch"
        >
          <ListCard :list="list"></ListCard>
        </v-col>
      </v-row>
    </transition-group>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ListCard from '../components/ListCard.vue';

export default {
  name: 'Lists',
  components: {
    ListCard,
  },
  data: () => ({
    isLoading: true,
  }),
  methods: {
    ...mapActions(['fetchLists']),
  },
  computed: {
    ...mapState(['lists']),
    showNoListsInfo() {
      return !this.isLoading && this.lists.length < 1;
    },
    loaderNumber() {
      return this.isLoading ? 3 : 0;
    },
  },
  mounted() {
    this.fetchLists().then(() => {
      this.isLoading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  li {
    line-height: 30px;
  }
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
</style>
