<template>
  <div class="list" :key="list.id">
    <user-auth-alert action="edit this list or save any changes" />
    <h1 class="d-flex">
      {{ list.title }}
      <v-icon
        class="justify-self-end ml-auto mr-2"
        title="Configure QuestList"
        @click="showPreferences = !showPreferences"
      >
        mdi mdi-cog
      </v-icon>
    </h1>
    <h3>{{ list.description }}</h3>
    <v-chip
      v-if="!!list.explicitContent"
      class="ma-2"
      color="red"
      text-color="white"
    >
      Explicit Content
    </v-chip>
    <v-btn
      style="display: block"
      class="ma-2"
      color="orange darken-2"
      dark
      @click="$router.back()"
    >
      <v-icon
        dark
        left
      >
        mdi-arrow-left
      </v-icon>Back
    </v-btn>
    <v-card
      v-if="showPreferences"
      elevation="3"
      class="border-1 pa-3 ma-2 mb-5"
    >
      <list-preferences
        compact
        :list="list"
        save-button-text="Update"
        @update:list="updateListPreferences"
      />
    </v-card>
    <h3>Active: {{ dependencyResolved }}</h3>
    <div id="items">
        <list-item
          v-for="(item, index) in listItemsWithBlank"
          :ref="`listItem${index}`"
          :key="`${index}`"
          :modelValue="item"
          :isNewItem="item.isNewItem"
          :states="states || globalPreferences.defaultStateGroup.states"
          :tabindex="index"
          @update="saveItem(index, $event)"
          @update:modelValue="appendItem(index, $event)"
          @delete="delItem(index, $event)"
          @enterPressed="focusNext(index, $event)"
          @tabPressed="focusNext(index, $event)"
        />
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import UserAuthAlert from '@/components/UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import {
  getListItems, getListStates, getListBySlug, saveListItems, updateUserItemStates, saveList,
} from '../firebase';
import {updateListInAlgolia} from '../algolia';
import ListPreferences from '../components/ListPreferences.vue';
import { getContrast } from "../colors"
import { getValueForDependency } from "../dependency";

export default {
  name: 'QuestList',
  components: {
    ListItem,
    UserAuthAlert,
    ListPreferences,
  },
  mixins: [userAuthMixin],
  beforeRouteUpdate(to) {
    this.loadList(to.params.slug);
  },
  beforeRouteEnter(to, _from, next) {
    next(vm => {
      vm.loadList(to.params.slug);
    });
  },
  beforeRouteLeave() {
    this.setPageBackgroundColor(null);
    if(this.hasModifiedList) this.addRecentlyUsedQuest(this.list);
  },
  props: {
    title: {
      type: String, // vue check to see if the type you passed is the expected type
      default: 'New List', // the default value. if the type is Object, this MUST use a function
      description: 'The title of the list you are displaying. Defaults to "New List".',
    },
    /**@type {string | string[]} */
    slug: {
      type: [String,Array],
      description: 'slug that identified a list',
    },
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
      hasModifiedList: false,
      dependencyResolved: null,
    };
  },
  computed: {
    listItemsWithBlank() {
      return [...this.listItems, { title: '', isNewItem: true }];
    },
  },
  methods: {
    ...mapMutations(['setPageBackgroundColor','setPageForegroundColor']),
    ...mapActions(['addRecentlyUsedQuest']),
    async resolveDependency(dependency) {
      if (!dependency) return true;
      this.dependencyResolved = await getValueForDependency(dependency);
    },
    updateListPreferences(newPrefs) {
      this.hasModifiedList = true;
      const updatedPrefs = { ...newPrefs };
      const { deletedValues } = updatedPrefs;
      delete updatedPrefs.deletedValues;
      if(updatedPrefs.color) {
        this.setPageBackgroundColor(updatedPrefs.color);
        this.setPageForegroundColor(getContrast(updatedPrefs.color));
      }
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
      this.listItems[index] = validItem;
      this.hasModifiedList = true;
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
      foundList = {...foundList.data(),  id: foundList.id };
      this.resolveDependency(foundList?.dependency);
      const listItems = await getListItems(foundList);
      const states = await getListStates(foundList);
      if(foundList.color) {
        this.setPageBackgroundColor(foundList.color);
        this.setPageForegroundColor(getContrast(foundList.color));
      }
      foundList.listItems = listItems;
      this.list = foundList;
      this.listItems = listItems;
      this.states = states;
    },
    async saveItem(idx, item) {
      const update = !item?.skipUpdate;
      if (item.skipUpdate) delete item.skipUpdate;

      const items = [...this.listItems];
      items[idx] = { ...item };
      await updateUserItemStates(this.list, items);
      await saveListItems(this.list.id, items);
      if(update) this.listItems = items;
      this.hasModifiedList = true;
      this.updateAlgolia();
    },
    updateAlgolia() {
      const obj = { ...this.list, listItems: this.listItems.map(i => i.title) };
      updateListInAlgolia(obj);
    },
    delItem(index) {
      const items = this.listItems.filter((_itm, idx) => idx !== index);
      this.listItems = items;
      saveListItems(this.list.id, items);
      this.hasModifiedList = true;
    },
    async addNewSubList() {
      await this.saveItem();
    },
    loadList(paramSlug) {
      let slugPathArray = paramSlug;
      if(!Array.isArray(slugPathArray))
        slugPathArray = [slugPathArray];
      const slug = slugPathArray[slugPathArray.length - 1]
      if(this.list.slug !== slug) this.fetchList({ slug });
    },
  },
};
</script>
<style scoped>
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
