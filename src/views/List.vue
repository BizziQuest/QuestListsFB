<template>
  <div>
    <user-auth-alert action="edit this list or save any changes" />
    <h1 class="d-flex">
      {{ list.title }}
      <v-icon class="justify-self-end ml-auto mr-2" @click="showPreferences = !showPreferences"
        title="Configure QuestList">
        mdi mdi-cog
      </v-icon>
    </h1>
    <h3>{{ list.description }}</h3>
    <v-chip class="ma-2" color="red" text-color="white" v-if="!!list.adultContent"> Adult Content </v-chip>
    <v-btn style="display: block" class="ma-2" color="orange darken-2" dark @click="$router.back()">
      <v-icon dark left> mdi-arrow-left </v-icon>Back
    </v-btn>
    <v-card elevation="3" v-if="showPreferences" class="border-1 pa-3 ma-2 mb-5">
      <list-preferences compact :list="list" @update:list="updateListPreferences" saveButtonText="Update">
      </list-preferences>
    </v-card>
    <div id="items">
      <transition-group name="slide-x-transition" hide-on-leave leave-absolute :duration="{ enter: 200, leave: 200 }">
        <list-item v-for="(item, index) in listItemsWithBlank" :ref="`listItem${index}`" :key="`${item.title}${index}`"
          :value="item" :states="states || globalPreferences.defaultStateGroup.states" @update="saveItem(index, $event)"
          @input="appendItem(index, $event)" @delete="delItem(index, $event)" @enterPressed="focusNext(index, $event)"
          :tabindex="index" />
      </transition-group>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import UserAuthAlert from '@/components/UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import {
  getListItems, getListStates, getListBySlug, saveListItems, updateUserItemStates, saveList,
} from '../firebase';
import ListPreferences from '../components/ListPreferences.vue';

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
    ListPreferences,
  },
  data() {
    return {
      list: {
        title: 'Loading...:)',
        id: undefined,
      },
      listItems: [],
      states: [],
      showPreferences: false,
    };
  },
  beforeRouteLeave() {
    this.setPageBackgroundColor(null);
  },
  computed: {
    listItemsWithBlank() {
      return [...this.listItems, { title: '', isNewItem: true }];
    },
  },
  methods: {
    updateListPreferences(newPrefs) {
      const updatedPrefs = { ...newPrefs };
      const { deletedValues } = updatedPrefs;
      delete updatedPrefs.deletedValues;
      if (Array.isArray(updatedPrefs.stateGroup)) {
        updatedPrefs.newStateGroup = updatedPrefs.stateGroup;
        updatedPrefs.stateGroup = this.list.stateGroup;
        if (deletedValues.length > 0) {
          this.list = this.list.map((item) => {
            if (deletedValues.includes(item.state)) {
              return { ...item, icon: updatedPrefs.stateGroup.states[0] };
            }
            return item;
          });
          saveListItems(this.list.id, this.items);
        }
      }
      this.list = { ...this.list, ...updatedPrefs };
      if (updatedPrefs.newStateGroup?.states) this.states = updatedPrefs.newStateGroup.states;
      saveList(this.list);
    },
    appendItem(index, item) {
      const validItem = { ...item };
      if (!item.state) [validItem.state] = this.states;
      if (index >= this.listItems.length) {
        this.listItems.push(validItem);
        this.$nextTick(() => this.focusNext(index - 1));
      }
    },
    focusNext(index) {
      const listItemRef = this.$refs[`listItem${index + 1}`];
      if (listItemRef?.length > 0) {
        listItemRef[0].$refs.input.focus(); // this will trigger blur(), which will save the items
      }
    },
    async fetchList({ slug }) {
      const context = slug.split('/');
      const currentSlug = context[context.length - 1];
      const fbList = await getListBySlug(currentSlug);
      if (!fbList || !fbList.docs || fbList.docs.length < 1) {
        this.errors = 'Could not locate list.';
        return;
      }
      let foundList = fbList.docs[fbList.docs.length - 1];
      foundList = { id: foundList.id, ...foundList.data() };
      const listItems = await getListItems(foundList);
      const states = await getListStates(foundList);
      this.setPageBackgroundColor(foundList.color);
      this.list.id = foundList.id || 'none';
      this.list = foundList;
      this.listItems = listItems;
      this.states = states;
    },
    saveItem(idx, item) {
      const items = [...this.listItems];
      items[idx] = { ...item };
      updateUserItemStates(this.list, items);
      saveListItems(this.list.id, items);
      this.listItems = items;
    },
    delItem(index) {
      const items = this.listItems.filter((_itm, idx) => idx !== index);
      this.listItems = items;
      saveListItems(this.list.id, items);
    },
    addNewSubList() {
      this.saveItem();
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
