<template>
  <div>
    <h1>{{list.title}}</h1>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in listItems" :key="`${item.text}${index}`">
        <list-item
          :listItem="item"
          :states="states"
          @blur="saveItem"
          :isNewItem="index === theList.listItems.length-1"
          @update:listItem="addNewItem(index, $event)"
        />
      </li>
     </ol>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import {
  getListItems,
  getListStates,
  listsCollection,
  saveListItems,
} from '../firebase';

export default {
  name: 'List',
  props: {
    title: {
      type: String, // vue check to see if the type you passed is the expected type
      default: 'New List', // the default value. if the type is Object, this MUST use a function
      description: 'The title of the list you are displaying. Defaults to "New List".',
    },
  },
  components: {
    ListItem,
  },
  data() {
    return {
      list: {
        title: 'Loading...',
      },
      listItems: [],
      states: [],
    };
  },
  methods: {
    async fetchList({ listId }) {
      // ? Should we check in $state.lists for the list, or trust firebase to get it without a network call?
      const doc = await listsCollection.doc(listId).get();
      const list = doc.data();
      list.id = doc.id;
      const listItems = await getListItems(list);
      const states = await getListStates(list);
      const listItemsLength = listItems.length;
      const theLastItem = listItems[listItemsLength - 1];
      if (!theLastItem || theLastItem.title.length !== 0) {
        listItems.push({ title: '', state: states[0].text });
      }
      this.list = list;
      this.listItems = listItems;
      this.states = states;
    },
    saveItem() {
      saveListItems(this.list, this.listItems);
    },
    ensureNewItem(index, item) {
      const lastItemIndex = this.listItems.length - 1;
      if (index < lastItemIndex) return;
      if (item.text.length !== 0) {
        this.listItems.push({ title: '', state: this.states[0].text });
      }
    },
  },
  mounted() {
    this.fetchList({ listId: this.$route.params.listId });
  },
};
</script>
<style lang='scss' scoped>
h1 {
  margin-top: 10px;
}
</style>
