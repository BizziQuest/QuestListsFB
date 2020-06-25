<template>
  <div>
    <h1>List</h1>
    <p>{{list}}</p>
    <p>{{list.listItems}}</p>
    <v-data-table
      :headers="headers"
      :items="list.listItems"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
    <v-btn v-on:click="addNewItem">+ New Item</v-btn>
  </div>
</template>
<script>
export default {
  name: 'List',
  props: ['title'],
  data() {
    return {
      headers: [
        {
          text: 'item',
          align: 'start',
          sortable: true,
          value: 'text',
        },
        { text: 'state', value: 'state' },
      ],
    };
  },
  methods: {
    addNewItem() {
      this.list.listItems.push({ text: 'item3', state: 'Done' });
    },
  },
  computed: {
    list() {
      return this.$store.getters.list(this.title);
    },
  },
};
</script>
