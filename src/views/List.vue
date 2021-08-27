<template>
  <div>
    <user-auth-alert action="edit this list or save any changes" />
    <h1>{{ list.title }}</h1>
      <v-btn class="ma-2"
      color="orange darken-2"
      dark
      @click="$router.back()" > <v-icon dark left> mdi-arrow-left </v-icon>Back </v-btn>
   <div id="items">
      <transition-group name="slide-x-transition" hide-on-leave leave-absolute :duration="{ enter: 200, leave: 200 }">
        <list-item
          v-for="(item, index) in listItems"
          :key="`${item.title}${index}`"
          :value="item"
          :states="states || globalPreferences.defaultStateGroup.states"
          @update="saveItem(index, $event)"
          @input="addNewItem(index, $event)"
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
  getListItems, getListStates, getListBySlug, saveListItems, updateUserItemStates,
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
      console.log('fetchList slug', slug);
      const currentSlug = context[context.length - 1];
      const fbList = await getListBySlug(currentSlug);
      // from my investigation there is logic problem here
      // specially for the subList, it cannot find the id of
      // it cuz it does not know how to look for it?

      // during your investigation, did you find out what type of object fbList is?
      // NOTE: when investigating, add comments on each line telling hwat it is doing.
      //       This is a form of "rubber-ducking"
      let foundList = fbList.docs[fbList.docs.length - 1];
      foundList = { id: foundList.id, ...foundList.data() };
      const listItems = await getListItems(foundList);
      console.log(listItems);
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
      const items = [...this.listItems];
      items[idx] = newItem;
      updateUserItemStates(this.list.id, items);
      saveListItems(this.list.id, items);
      this.listItems = items;
      this.addNewItem(idx, newItem);
    },
    delItem(index) {
      const items = this.listItems.filter((_itm, idx) => idx !== index);
      this.listItems = items;
      saveListItems(this.list.id, items);
    },
    addNewSubList() {
      this.saveItem();
    },
    addNewItem(index, item) {
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
    this.fetchList({ slug: this.slug });
  },
};
</script>
<style lang='scss' scoped>
h1 {
  margin-top: 10px;
}

.expand-transition-enter-active,
.expand-transition-leave-active {
  transition-duration: 2s !important;
  // position: fixed !important;
}

#items {
  width: 100%;
}
</style>
