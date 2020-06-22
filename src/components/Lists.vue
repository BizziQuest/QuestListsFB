<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col v-if="lists.length < 1" col="12" xs="12" md="12">
        <v-alert icon="mdi-emoticon-sad" type="info">Please add some stuff</v-alert>
      </v-col>
      <v-col v-else v-for="list in lists" :key="list.title" cols="12" xs="12" sm="6" md="4">
        <ListCard :list="list"></ListCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ListCard from './ListCard.vue';

export default {
  name: 'Lists',
  components: {
    ListCard,
  },
  computed: {
    userInfo() {
      return this.$store.getters.user;
    },
    lists() {
      return this.$store.getters.lists;
    },
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
