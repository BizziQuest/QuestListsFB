<template>
  <div>
    <h1>{{list.title}}</h1>
    <user-auth-alert action="edit this list"/>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in listItems" :key="`${item.title}${index}`">
        <list-item
          :listItem="item"
          :value="item"
          :states="states || globalPreferences.defaultStateGroup.states"
          @blur="saveItem(index, $event)"
          @input="addNewItem(index, $event)"
          :tabindex="index"
        />
      </li>
     </ol>
  </div>
</template>
<script>
import ListItem from '@/components/ListItem.vue';
import UserAuthAlert from '@/components/UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
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
  mixins: [userAuthMixin],
  components: {
    ListItem,
    UserAuthAlert,
  },
  data() {
    return {
      list: {
        title: 'Loading...',
        id: undefined,
      },
      listItems: [],
      states: [],
    };
  },
  methods: {
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
        listItems.push({ title: '', isNewItem: true });
      }
      this.list.id = foundedList.id || 'none';
      this.list = foundedList;
      this.listItems = listItems;
      this.states = states;
    },
    saveItem(idx, newItem) {
      const items = this.listItems.slice(0, -1);
      items[idx] = newItem;
      saveListItems(this.list.id, items);
      this.addNewItem(idx, newItem);
    },
    addNewSubList() {
      this.saveItem();
    },
    addNewItem(index, item) {
      const lastItemIndex = this.listItems.length - 1;
      if (index < lastItemIndex) return;
      if (item.length !== 0) {
        const lastItem = this.listItems[lastItemIndex];
        delete lastItem.isNewItem;
        this.listItems.push({
          title: '',
          isNewItem: true,
        });
      }
    },
  },
  mounted() {
    const path = this.$route.params.slug.split('/');
    this.fetchList({ slug: path[path.length - 1] });
  },
};
</script>
<style lang='scss' scoped>
h1 {
  margin-top: 10px;
}
</style>
