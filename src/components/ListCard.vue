<template>
  <v-card
    max-height="auto"
    :color="list.color"
    class="list-card"
    style="margin-bottom: 20px; margin-right: 0px; border-radius: 10px;"
  >
    <v-list-item :to="{ name: 'List', params: { slug: list.slug }}">
      <v-img :src="list.image || 'https://picsum.photos/200/300'" max-width="100"></v-img>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">{{list.title}}</v-list-item-title>
        <v-list-item-subtitle>{{list.description}}</v-list-item-subtitle>
        <ul>
          <li>Next Items:</li>
          <li v-for="item in updatedList.nextItems"
              :color="globalPreferences.defaultStateGroup.color" :key="item.order">
            <list-item
              v-if="item"
              :list-item="item"
              :value="item"
              :states="states || globalPreferences.defaultStateGroup.states"
              @click.prevent="null"
            />
          </li>
        </ul>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { getListStates } from '../firebase';
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
    updatedList: [],
    states: [],
  }),
  computed: {
    ...mapState(['globalPreferences']),
  },
  async mounted() {
    this.states = await getListStates(this.list);
    this.updatedList = this.$props.list;
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
