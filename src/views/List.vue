<template>
  <div>
    <h1>{{list.title}}</h1>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in listItems" :key="`${item.text}${index}`">
        <list-item
          :listItem="item"
          :currentState="'whatever'"
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
import { mapState } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import { v4 as uuidv4 } from 'uuid';

import {
  getListItems,
  getUserItemStates,
  getListPossibleStates,
  listsCollection,
  saveListItems,
  // setUserItemStates,
  auth,
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
      userStates: [],
    };
  },
  computed: {
    // ...mapGetter(['getCurrentUser']),
    ...mapState({
      currentUser(state) {
        if (!auth.currentUser) return null;
        console.info('Current User @getCurrentUser: ', state.currentUser, auth);
        this.userStates = getUserItemStates(auth.currentUser.uid, this.list.id);
        return state.currentUser;
      },
    }),
  },
  methods: {
    async fetchList({ listId }) {
      // ? Should we check in $state.lists for the list, or trust firebase to get it without a network call?
      console.info('Current User @fetchList: ', this.currentUser, auth.currentUser);
      const doc = await listsCollection.doc(listId).get();
      const list = doc.data();
      list.id = doc.id;
      const listItems = await getListItems(list);
      const states = await getListPossibleStates(list);
      // get all user states
      this.userStates = getUserItemStates(list.id);
      const listItemsLength = listItems.length;
      const theLastItem = listItems[listItemsLength - 1];
      if (!theLastItem || !theLastItem.isNewItem) {
        listItems.push({ title: 'New Item', isNewItem: true, id: uuidv4() });
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
          id: uuidv4(),
          isNewItem: true,
        });
      }
    },
    async updateUserState(listItemIndex, iconIndex) {
      // TODO: we need to pass the list item ID instead of the index to  this function
      // this.userStates is a DocumentSnapshot

      this.userStates[listItemIndex] = iconIndex;

      // this.userStates.save();
      const userStates = await this.userStates;
      console.log(typeof userStates, userStates.get());
      // await setUserItemStates(this.list.id, userStates);
    },
  },
  mounted() {
    this.fetchList({ listId: this.$route.params.listId });
    // get all the user states and set them
    // console.info('Current User @mounted: ', this.currentUser, auth.currentUser);
  },
};
</script>
<style lang='scss' scoped>
h1 {
  margin-top: 10px;
}
</style>
