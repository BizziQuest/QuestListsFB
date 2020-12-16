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
              >{{ icon }}</v-icon
            >
            <v-text-field
              style="margin-bottom: 20px"
              v-model="title"
              :outlined="isActive"
              @click.prevent="activate"
              @blur="deactivate"
              :placeholder="placeholder"
              >{{ isNewItem ? "No Title" : title }}</v-text-field
            >
            <v-btn
              v-if="!subList"
              :loading="creatingSubList"
              :disabled="creatingSubList"
              @click="makeSublist()"
            >
              add Sublist
            </v-btn>
            <router-link :to="subListPath" v-else> sublist link </router-link>
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
    value: {
      type: Object,
      default: () => ({}),
      description: 'List Item is an object in the form: {title, state}',
    },
    states: {
      type: Array,
      default: () => [],
      description: 'The list of states that this item should have.',
    },
  },
  data: () => ({
    title: '',
    isActive: false,
    isNewItem: false,
    currentStateIdx: 0,
    subListSlug: '',
    subListPath: '',
    subList: null,
    creatingSubList: false,
    listId: '',
  }),
  methods: {
    emitUpdate(newValues) {
      const newItem = { ...this.value };
      if (this.isNewItem) newItem.isNewItem = this.isNewItem;
      if (this.subList) newItem.subList = this.subList;
      this.$emit('input', {
        ...newItem,
        ...newValues,
      });
    },
    deactivate() {
      this.isActive = false;
      this.emitUpdate();
    },
    activate() {
      this.isActive = true;
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
        title: this.title,
        description: `sublist of ${this.title}`, // same as title
        stateGroup,
      };
      this.subList = await createList(payload);
      this.subListSlug = this.subList.slug;
      this.emitUpdate();
      await this.computeSubListPath(this.subList);
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
    this.title = this.$props.value.title;
    this.isNewItem = this.$props.value.isNewItem;
    this.listId = this.$props.value.listId;
    if (this.$props.value.subList) {
      await this.computeSubListPath(this.$props.subList);
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
      return this.isNewItem ? 'New Item' : '';
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
