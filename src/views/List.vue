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
          @update:icon="updateUserState(index, $event)"
        />
      </li>
     </ol>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters([
      'currentUser',
    ]),
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
      if (!theLastItem || !theLastItem.isNewItem) {
        listItems.push({ title: 'New Item', isNewItem: true });
      }
      this.list = list;
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
    // updateUserState(itemIndex, stateIndex) {
    updateUserState() {
      // const currentUserId = this.currentUser.id;
      // QUESTION: should this be in /user/ or /userListItemStates/ ?
      // const path = `/userListItemStates/${currentUserId}/listItems/${list.id}/states`
      // 1. upsert (find or create) the userListItemState doc with the current user ID
      // 2. upsert the listItem collection doc with the list id
      // 3. create the item in the list for the doc
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
