<template>
  <div>
    <br>
    <h1>List</h1>
    <p>{{theList}}</p>
    <p>{{theList.listItems}}</p>
    <ol style="list-style-type:none;">
      <li v-for="(item,i) in theList.listItems" :key="`${item.text}${i}`">
        <list-item :listItem="item"/>
      </li>
    </ol>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ListItem from '../components/ListItem.vue';

export default {
  name: 'List',
  props: ['title'],
  components: {
    ListItem,
  },
  data() {
    return {
      disabled: false,
      someObj: { text: 'Dima' },
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
