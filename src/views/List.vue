<template>
  <div>
    <br>
    <h1>List</h1>
    <p>{{list}}</p>
    <p>{{list.listItems}}</p>
    <ol style="list-style-type:none;">
      <li v-for="(item,i) in listItems" :key="`${item.text}${i}`">
        <list-item :listItem="item"/>
      </li>
    </ol>
  </div>
</template>
<script>

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
  methods: {
    loseFocus(ref) {
      this.$refs[ref][0].outlined = false;
    },
    setFocus(ref) {
      console.log(this.$refs[ref]);
      this.$refs[ref][0].outlined = true;
    },
    // not usage in this branch
    // itemChanged($event) {
    //   this.saveToServer(this.items);
    // },
  },
  computed: {
    listItems() {
      return this.list.listItems;
    },
    list() {
      return this.$store.getters.list(this.title);
    },
    allItemsStates() {
      return this.$store.getters.itemStates;
    },
  },
};
</script>
