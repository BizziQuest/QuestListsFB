<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="lists && lists.length < 1" col="12" md="6" class='mt-5'>
        <v-alert prominent icon="mdi-emoticon-sad" type="info">
          Please add some stuff
        </v-alert>
      </v-col>
      <v-col v-if="lists === null" col="12" md="12" class='mt-5'>
        <v-skeleton-loader v-for="i in 6" :key="i"
          transition="fade"
          class="mx-auto"
          max-width="800"
          type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
        ></v-skeleton-loader>
      </v-col>
      <v-col v-else v-for="list in lists" :key="list.id" col="12" md="4">
        <ListCard :list="list"></ListCard>
      </v-col>
    </v-row>
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
</style>
