<template>
  <div>
    <user-auth-alert action="edit this list or save any changes" />
    <h1>{{ list.title }}</h1>
    <v-btn class="ma-2" color="orange darken-2" dark @click="$router.back()">
      <v-icon dark left> mdi-arrow-left </v-icon>Back
    </v-btn>
    <div id="items">
      <transition-group
        name="slide-x-transition"
        hide-on-leave
        leave-absolute
        :duration="{ enter: 200, leave: 200 }"
      >
        <list-item
          v-for="(item, index) in listItems"
          :key="`${item.title}${index}`"
          :value="item"
          :states="states || globalPreferences.defaultStateGroup.states"
          @update="saveItem(index, $event)"
          @input="ensureNewEmptyItem(index, $event)"
          @delete="delItem(index, $event)"
          :tabindex="index"
        />
      </transition-group>
    </div>
  </div>
</template>
<script>
import ListItem from '@/components/ListItem.vue';
import UserAuthAlert from '@/components/UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import {
  getListItems,
  getListStates,
  getListBySlug,
  saveListItems,
  updateUserItemStates,
} from '../firebase';

export default {
  name: 'List',
  props: {
    title: {
      type: String, // vue check to see if the type you passed is the expected type
      default: 'New List', // the default value. if the type is Object, this MUST use a function
      description: 'The title of the list you are displaying. Defaults to "New List".',
    },
    slug: {
      type: String,
      description: 'slug that identifed a list',
    },
  },
  mixins: [userAuthMixin],
  components: {
    ListItem,
    UserAuthAlert,
  },
  data() {
    return {
      list: {
        title: 'Loading...',
        id: undefined,
      },
      listItems: [],
      states: [],
    };
  },
  methods: {
    async fetchList({ slug }) {
      const context = slug.split('/');
      const currentSlug = context[context.length - 1];
      const fbList = await getListBySlug(currentSlug);
      let foundList = fbList.docs[fbList.docs.length - 1];
      foundList = { id: foundList.id, ...foundList.data() };
      const listItems = await getListItems(foundList);
      const states = await getListStates(foundList);
      const listItemsLength = listItems.length;
      const theLastItem = listItems[listItemsLength - 1];
      if (!theLastItem || !theLastItem.isNewItem) {
        listItems.push({ title: '', isNewItem: true });
      }
      this.list.id = foundList.id || 'none';
      this.list = foundList;
      this.listItems = listItems;
      this.states = states;
    },
    async saveItem(idx, item) {
      const newItem = { ...item };
      const items = this.listItems.filter((i) => (i.title && i.title !== '') && !i.newItem);
      items[idx] = newItem;
      updateUserItemStates(this.list.id, items);
      saveListItems(this.list.id, items);
      this.listItems = items;
      this.ensureNewEmptyItem(idx, newItem);
    },
    delItem(index) {
      const items = this.listItems.filter((_itm, idx) => idx !== index);
      this.listItems = items;
      saveListItems(this.list.id, items);
    },
    addNewSubList() {
      this.saveItem();
    },
    ensureNewEmptyItem(index, item) {
      const lastItemIndex = this.listItems.length - 1;
      if (index < lastItemIndex) return;
      if (item.length !== 0) {
        const lastItem = this.listItems[lastItemIndex];
        delete lastItem.isNewItem;
        this.listItems.push({
          title: '',
          isNewItem: true,
        });
      }
    },
  },
  mounted() {
    const path = this.$route.params.slug.split('/');
    this.fetchList({ slug: path[path.length - 1] });
  },
};
</script>
<style lang="scss" scoped>
h1 {
  margin-top: 10px;
}

.expand-transition-enter-active,
.expand-transition-leave-active {
  transition-duration: 2s !important;
}

#items {
  width: 100%;
}
</style>
