<template>
  <div>
    <h1>List</h1>
    <p>{{list}}</p>
    <p>{{list.listItems}}</p>
    <v-list>
      <v-list-item v-for="item in listItems" :key="item.text">
        <v-row>
          <v-col col="6">
            <div contenteditable>{{item.text}}</div>
          </v-col>
          <v-col col="6" v-on:click="enabled" >
            <v-select ref="me" :disabled="disabled" :items="allItemsStates" :label="item.state" outlined></v-select>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  name: 'List',
  props: ['title'],
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    enabled() {
      console.log(this.$refs.me);
      this.$refs.me.disabled = !this.disabled;
    },
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
