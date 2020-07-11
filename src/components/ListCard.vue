<template>
  <v-card
    max-height="auto"
    :color="list.color"
    class="list-card"
    style="margin-bottom: 20px; margin-right: 0px; border-radius: 25px;"
  >
    <v-list-item>
      <v-img :src="list.image" class="list-image"></v-img>
      <v-list-item-content>
        <v-btn text v-bind:to="'/Lists/' + list.title"  class="justify-start mb-4">
          {{list.title}}
        </v-btn>
        <v-list-item-title class="headline mb-1">{{list.description}}</v-list-item-title>
        <v-list-item-subtitle>{{list.description}}</v-list-item-subtitle>
        <ul>
          <li v-for="item in listItems" :color="defaultState.color" :key="item.order">
            <v-icon :title="defaultState.text">{{defaultState.icon}}</v-icon>
            {{ item.title }}
          </li>
        </ul>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn fab>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab v-bind:to="'/Lists/' + list.title">
            <v-icon>pageview</v-icon>
          </v-btn>
        </v-card-actions>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ListCard',
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
  async mounted() {
    const items = await this.list.listItems.get();
    const listItems = [];
    items.data().items.forEach((item) => listItems.push(item));
    this.listItems = listItems;
  },
};
</script>

<style lang="scss" scoped>
* {
  color: black;
}
.large-image {
  max-height: 100%;
  max-width: 50%;
}
.small-image {
  max-width: 100%;
  max-height: 50%;
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
  width: 100px;
}
</style>
