<template>
  <div>
    <br />
    <h1>List</h1>
    <p>{{list}}</p>
    <p>{{list.listItems}}</p>
    <ol style="list-style-type:none;">
      <li v-for="(item,i) in listItems" :key="`${item.text}${i}`">
        <list-item :listItem="item" :states="item.states" />
      </li>
      <!-- <li>
        // you should make sure your list-item handles cases where the text is not defined,
        // so it will be a New Item list item.
        // That means instead of duplicating your effort everywhere this new item is needed,
        // we can just use the list-item component.
        <list-item :listItem="{ text: '', state: '' }" />
      </li>-->
    </ol>
    <v-container>
      <v-row>
        <v-col col="12" md="6">
          <v-text-field
            v-model="entry"
            style="margin-bottom:20px;"
            :prepend-icon="entry.length < 1 ? 'add' : 'mdi-checkbox'"
            placeholder="List Item"
            autofocus
            counter
            ref="newTextField"
            @change="lengthTextField"
          ></v-text-field>
        </v-col>
        <v-col col="12" md="6" v-show="entry.length > 0">
          <v-select style="margin-bottom:20px;"></v-select>
        </v-col>
      </v-row>
    </v-container>
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
      entry: '',
      disabled: false,
      isOutlined: false,
      stateShow: false,
    };
  },
  methods: {
    lengthTextField() {
      console.log(this.entry);
      if (this.entry !== 0) {
        this.stateShow = true;
        // this.listItems.push({ text: 'text', state: 'not done' });
      } else {
        this.stateShow = false;
      }
    },
    loseFocus(ref) {
      this.$refs[ref][0].outlined = false;
    },
    setFocus(ref) {
      console.log(this.$refs[ref]);
      this.$refs[ref][0].outlined = true;
    },
    itemChanged($event) {
      console.log('itemChanged -> $event', $event);
      this.saveToServer(this.items);
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
