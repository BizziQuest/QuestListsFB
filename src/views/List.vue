<template>
  <div>
    <h1>{{list.title}}</h1>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in listItems" :key="`${item.text}${index}`">
        <list-item
          :listItem="item"
          :states="states || globalPreferences.defaultStateGroup.states"
          @blur="saveItem"
          :isNewItem="item.isNewItem"
          @update:text="addNewItem(index, $event)"
        />
      </li>
     </ol>
  </div>
</template>
<script>
// import { mapGetters, mapMutations } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import {
  getListItems,
  getListStates,
  listsCollection,
  saveListItems,
} from '../firebase';
// import { debug } from 'webpack';
// import ListCardVue from '../components/ListCard.vue';

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
    // async fetchList({ listId }) {
    async fetchList({ slug }) {
      const doc = await listsCollection.where('slug', '==', slug);
      const result = await doc.get();
      let foundedList;
      // TODO: ensure we have only one slug. We should warn otherwise.
      // we are assuming there is only one slug that matches this value.
      // this may break under certain circumstances
      // is not done?
      result.forEach((list) => {
        foundedList = { id: list.id, ...list.data() };
      });
      const listItems = await getListItems(foundedList);
      const states = await getListStates(foundedList);
      const listItemsLength = listItems.length;
      const theLastItem = listItems[listItemsLength - 1];
      if (!theLastItem || !theLastItem.isNewItem) {
        listItems.push({ title: 'New Item', isNewItem: true });
      }
      this.list = foundedList;
      this.listItems = listItems;
      this.states = states;
    },
    saveItem() {
      const items = this.listItems.slice(0, -1);
      saveListItems(this.list.id, items);
    },
    addNewItem(index, item) {
      const lastItemIndex = this.listItems.length - 1;
      if (index < lastItemIndex) return;
      if (item.length !== 0) {
        const lastItem = this.listItems[lastItemIndex];
        lastItem.isNewItem = undefined;
        this.listItems.push({
          text: 'New Item',
          isNewItem: true,
        });
      }
    },
  },
  mounted() {
    // this.fetchList({ listId: this.$route.params.listId });
    this.fetchList({ slug: this.$route.params.slug });
  },
};
</script>
<style lang='scss' scoped>
h1 {
  margin-top: 10px;
}
</style>
