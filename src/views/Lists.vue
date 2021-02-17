<template>
  <v-container fluid>
    <transition-group tag="div" class="row" name="fade">
      <v-col v-if="lists === null" key="skeleton" class='mt-5'>
        <v-skeleton-loader v-for="i in 6" :key="i"
          class="mx-auto"
          max-width="800"
          type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
        ></v-skeleton-loader>
      </v-col>
      <v-row v-if="lists && lists.length < 1" key="sad" class='ml-5 mr-5 mt-10'>
        <v-alert prominent icon="mdi-shield-plus-outline" type="info" class="col-12">
          Welcome to Quest Lists! You don't have any Quests yet, but have no fear, simply click on the
          <v-icon>mdi-shield-plus-outline</v-icon> icon on the left to get started!
        </v-alert>
      </v-row>
      <v-col v-else v-for="list in lists" :key="list.id" col="12" md="4" class="d-flex align-stretch">
        <ListCard :list="list"></ListCard>
      </v-col>
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
  methods: {
    ...mapActions(['fetchLists']),
  },
  computed: {
    ...mapState(['lists']),
  },
  mounted() {
    this.fetchLists();
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
  opacity: 0
}
</style>
