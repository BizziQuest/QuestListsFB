<template>
  <v-card
    max-height="auto"
    :color="list.color"
    class="list-card"
    style="margin-bottom: 20px; margin-right: 0px; border-radius: 10px;"
  >
    <v-list-item :to="{ name: 'List', params: { listId: list.id }}">
      <v-img :src="list.image || 'https://picsum.photos/200/300'" max-width="100"></v-img>
      <v-list-item-content>
        <v-btn text class="justify-start mb-4">
          {{list.title}}
        </v-btn>
        <v-list-item-title class="headline mb-1">{{list.description}}</v-list-item-title>
        <v-list-item-subtitle>{{list.description}}</v-list-item-subtitle>
        <ul>
          <li>Preview: </li>
          <li v-for="item in listItems" :color="defaultState.color" :key="item.order">
            <list-item :list-item="item" :states="states || globalPreferences.defaultStates" @click.prevent="null">
            <!-- <v-icon :title="defaultState.text">{{defaultState.icon}}</v-icon>
            {{ item.title }} -->
          </list-item>
          </li>
        </ul>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import ListItem from './ListItem.vue';

export default {
  name: 'ListCard',
  components: {
    ListItem,
  },
  props: {
    list: {
      type: Object,
      default: () => ({}),
      description: 'The list that is to be shown. Should contain listItems, title, description, and image',
    },
    large: {
      type: Boolean,
      default: false,
      description: 'Whether to use a layout suitable for larger cards, where The image '
                    + 'is on top and more items are shown.',
    },
  },
  data: () => ({
    listItems: [],
    states: [],
    defaultState: {
      icon: 'mdi-checkbox-blank-outline',
      color: '',
      text: 'Done',
      value: '0',
    },
  }),
  computed: {
    ...mapState(['globalPreferences']),
  },
  methods: {
    // This is a method becaue it only needs to be done once
    async getListItems() {
      let items = await this.list.listItems.limit(4).get();
      if (!items) return;

      items = items.data();
      if (!Object.prototype.hasOwnProperty.call(items, 'items')) return;

      items = items.items;
      items = items.map((item) => item); // items doesn't pass the Array.isArray test, so we make it
      this.listItems = items.sort((a, b) => a.order < b.order);
    },
    async getListStates() {
      let state = await this.list.states.get();
      if (!state) return;
      state = state.data();
      const states = [];
      state.order.forEach((stateName) => states.push(state.states[stateName]));
      this.states = states;
    },
  },
  mounted() {
    this.getListItems();
    this.getListStates();
  },
};
</script>

<style lang="scss" scoped>
* {
  color: black;
}
ul {
  margin-left: 0px;
  padding-left: 0px;
  li {
    padding-left: 0px;
    margin-left: 0px;
  }
}
.large-image {
  max-height: 100%;
  max-width: 50%;
}
.small-image {
  max-width: 30%;
  max-height: 100%;
}
ul {
  list-style-type: none;
  li {
    line-height: 30px;
  }
}
.list {
  height: 99px;
  overflow: auto;
}
.v-list-item {
  display:flex;
  padding: 0px;
  align-items: stretch;
}

.list-image {
  border-radius: 10px;
  width: 30%;
}
</style>
