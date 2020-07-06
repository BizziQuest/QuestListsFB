<template>
  <v-container fluid>
      <v-row no-gutters>
        <v-col v-if="lists && lists.length < 1" col="12" md="12" class='mt-5'>
          <v-alert prominent icon="mdi-emoticon-sad" type="info">
            There are no lists yet. Please add a list.
          </v-alert>
        </v-col>
        <v-col v-if="lists === null" col="12" md="12" class='mt-5'>
          <v-alert prominent icon="mdi-emoticon-happy" type="info">
            Loading...
          </v-alert>
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
    ...mapActions(['getLists']),
  },
  computed: {
    ...mapState(['lists']),
  },
  mounted() {
    this.getLists();
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
