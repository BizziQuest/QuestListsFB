<template>
  <div>
    <h1>List</h1>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in theList.listItems" :key="`${item.text}${index}`">
        <list-item :listItem="item" @add-empty-obj="addEmptyItem"/>
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
    ...mapGetters(['list']),
    theList() {
      const wantedList = this.list(this.title);
      console.log('wantedList', wantedList);
      const listItemsLength = wantedList.listItems.length;
      console.log('this is the last item of the List', wantedList.listItems[listItemsLength - 1]);
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
    addEmptyItem(item) {
      console.log('"this is updateItem"', item);
      const listItemsLength = this.theList.listItems.length;
      console.log('this is the last item of the List', this.theList.listItems[listItemsLength - 1]);
      const theLastItem = this.theList.listItems[listItemsLength - 1];
      if (theLastItem.text.length !== 0) {
        this.theList.listItems.push(item);
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
