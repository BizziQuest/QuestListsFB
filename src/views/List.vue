<template>
  <div>
    <h1>List</h1>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in theList.listItems" :key="`${item.text}${index}`">
        <list-item :listItem="item" @update:listItem="ensureNewItem(index, $event)"/>
      </li>
     </ol>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ListItem from '@/components/ListItem.vue';

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
      entry: '',
    };
  },
  computed: {
    ...mapGetters({ listGetter: 'list' }),
    theList() {
      const wantedList = this.listGetter(this.title);
      const listItemsLength = wantedList.listItems.length;
      const theLastItem = wantedList.listItems[listItemsLength - 1];
      if (theLastItem.text.length !== 0) {
        wantedList.listItems.push({ text: '', state: 'Not Done' });
      }
      return wantedList;
    },
    listItems() {
      return this.theList.listItems;
    },
  },
  methods: {
    ensureNewItem(index, item) {
      const lastItemIndex = this.theList.listItems.length - 1;
      if (index < lastItemIndex) return;
      if (item.text.length !== 0) {
        this.theList.listItems.push({ text: '', state: 'Not Done' });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
h1 {
  margin-top: 10px;
}
</style>
