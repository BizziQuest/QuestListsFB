<template>
  <div>
    <h1>List</h1>
    <ol style="list-style-type:none;">
      <li v-for="(item,index) in theList.listItems" :key="`${item.text}${index}`">
        <list-item :listItem="item"/>
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
    type: String,  // vue check to see if the type you passed is the expected type
    default: "New List",  //the default value. if the type is Object, this MUST use a function
    description: 'The title of the list you are displaying. Defaults to "New List".'
    }
  },
  components: {
    ListItem,
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
