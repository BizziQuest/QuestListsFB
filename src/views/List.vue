<template>
  <div>
    <h1>List</h1>
    <p>{{theList}}</p>
    <p>{{theList.listItems}}</p>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in theList.listItems" :key="`${item.text}${index}`">
        <list-item :listItem="item"/>
      </li>
      <!-- <li>
        // you should make sure your list-item handles cases where the text is not defined,
        // so it will be a New Item list item.
        // That means instead of duplicating your effort everywhere this new item is needed,
        // we can just use the list-item component.
        <list-item :listItem="{ text: '', state: '' }" />
      </li>-->
    </ol>
    <v-container>
      <v-row>
        <v-col col="12" md="6">
          <v-text-field
            v-model="entry"
            style="margin-bottom:20px;"
            :prepend-icon="entry.length < 1 ? 'add' : 'mdi-checkbox'"
            placeholder="List Item"
            autofocus
            counter
            ref="newTextField"
            @change="lengthTextField"
          ></v-text-field>
        </v-col>
        <v-col col="12" md="6" v-show="entry.length > 0">
          <v-select style="margin-bottom:20px;"></v-select>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ListItem from '@/components/ListItem.vue';

export default {
  name: 'List',
  props: ['title'],
  components: {
    ListItem,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['list']),
    theList() {
      return this.list(this.title);
    },
    listItems() {
      return this.theList.listItems;
    },
  },
};
</script>
<style lang='scss' scoped>
  h1 {
    margin-top: 10px;
  }
</style>
