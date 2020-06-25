<template>
  <v-container fluid>
      <v-row no-gutters>
        <v-col v-if="lists.length < 1" col="12" md="12" class='mt-5'>
          <!--div style="color: red">Drawer: {{ drawer }}</div>
          <div style="color: red">User: {{ userInfo }}</div-->
          <v-alert prominent icon="mdi-emoticon-sad" type="info">
            Please add some stuff
          </v-alert>
        </v-col>
        <v-col v-else v-for="list in lists" :key="list.bgColor" col="12" md="4">
          <ListCard :list = "list"></ListCard>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import ListCard from '../components/ListCard.vue';

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
