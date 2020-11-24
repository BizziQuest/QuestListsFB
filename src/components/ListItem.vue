<template>
  <div class="list-item-view">
    <template>
      <v-container>
        <v-row>
          <v-col col="12" md="6">
            <v-icon
              large
              class="listitem-icon"
              :outlined="isActive"
              @click.prevent="cycleIcon"
              @blur="deactivate"
              :title="iconTitle"
            >{{icon}}</v-icon>
            <v-text-field
              style="margin-bottom:20px;"
              :value="listItem.title"
              @change="listItem.title = $event"
              @input="updateText($event)"
              :outlined="isActive"
              @click.prevent="activate"
              @blur="deactivate"
              :placeholder="placeholder"
              >{{ listItem.isNewItem ? 'No Title' : listItem.title }}</v-text-field
            >
            <v-btn v-if="!listItem.subList"
                   :loading="creatingSubList"
                   :disabled="creatingSubList"
                   @click='makeSublist()'>
                   add Sublist
            </v-btn>
            <router-link
              :to="subListPath"
              v-else>
                sublist link
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createList, stateGroupsCollection } from '../firebase';

export default {
  props: {
    listItem: {
      type: Object,
      default: () => ({}),
      description: 'List Item is an object in the form: {title, state}',
    },
    states: {
      type: Array,
      default: () => [],
      description: 'The list of states that this item should have.',
    },
    isNewItem: {
      type: Boolean,
      description: 'it is new item entry',
    },
    listId: {
      type: String,
      describe: 'id of the list',
    },
  },
  data: () => ({
    isActive: false,
    currentStateIdx: 0,
    subListSlug: '',
    subListPath: '',
    subList: null,
    creatingSubList: false,
  }),
  methods: {
    deactivate() {
      this.isActive = false;
      this.$emit('blur', this.listItem);
    },
    activate() {
      this.isActive = true;
    },
    updateText(text) {
      this.$emit('update:text', text);
    },
    cycleIcon() {
      if (this.isNewItem) return;
      this.activate();
      let nextIdx = this.currentStateIdx + 1;
      if (nextIdx > this.states.length - 1) nextIdx = 0;
      this.currentStateIdx = nextIdx;
    },
    async makeSublist() {
      this.creatingSubList = true;
      const stateGroupDoc = this.getGlobalPreferences.defaultStateGroup;
      const stateGroup = stateGroupsCollection.doc(stateGroupDoc.id);
      const payload = {
        title: this.listItem.title,
        description: `sublist of ${this.listItem.title}`, // same as title
        stateGroup,
      };
      this.listItem.subList = await createList(payload);
      this.subListSlug = this.listItem.subList.slug;
      this.$emit('update:subList', this.listItem.subList);
      this.$forceUpdate();
      await this.computeSubListPath(this.listItem.subList);
      this.creatingSubList = false;
    },
    async computeSubListPath(subListRef) {
      if (!subListRef) return;
      const subList = await subListRef.get();
      const { slug } = subList.data();
      this.subListPath = `${this.$route.path}/${slug}`;
    },
  },
  async mounted() {
    if (this.$props.listItem.subList) {
      await this.computeSubListPath(this.$props.listItem.subList);
    }
  },
  computed: {
    ...mapGetters(['itemStates', 'getGlobalPreferences']),
    icon() {
      if (this.isNewItem) return 'mdi-plus';
      return this.states[this.currentStateIdx] && this.states[this.currentStateIdx].icon;
    },
    iconTitle() {
      return this.states[this.currentStateIdx] && this.states[this.currentStateIdx].name;
    },
    placeholder() {
      return this.listItem.isNewItem ? 'New Item' : '';
    },
    haveParent() {
      return this.listId !== 'none';
    },
  },
};
</script>

<style lang="scss" scoped>
.listitem-icon {
  display: inline-flex;
  margin-right: 10px;
}
.listitem-text {
  display: inline-block;
}
</style>
