<template>
  <div class="list-item-view">
    <v-text-field
      dense
      v-model="title"
      @blur="deactivate"
      @click.prevent="activate"
      @input="emitUpdate({ title: $event })"
      :clearable="!readOnly"
      :flat="readOnly"
      :hide-details="readOnly"
      :outlined="isActive"
      :placeholder="placeholder"
      :readonly="readOnly"
      :single-line="readOnly"
      :solo="readOnly"
      :tabindex="tabindex"
      >
        <v-icon
          slot="prepend-inner"
          class="listitem-icon"
          :outlined="isActive"
          @click.prevent="cycleIcon"
          @blur="deactivate"
          :title="iconTitle"
        >{{icon}}</v-icon>
        {{ isNewItem ? '' : title }}
        <v-btn
          v-if="(!readOnly && !subList) || title !== null"
          slot="append"
          :loading="creatingSubList"
          :disabled="creatingSubList"
          title="Make a new sublist from this item."
          icon
          @click='makeSublist()'>
          <v-icon>mdi-shield-plus-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          slot="append"
          :to="subListPath"
          title="Edit / View Sublist"
          v-if="!readOnly && subList">
            <v-icon>mdi-shield-link-variant-outline</v-icon>
        </v-btn>
        <v-btn
        icon
        slot="append"
        title="delete"
        v-if="!isNewItem && title !== null"
        @click="emitDelete">
        <v-icon>mdi-delete</v-icon>
        </v-btn>
    </v-text-field>
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
    readOnly: {
      type: Boolean,
      default: false,
      description: 'Whether to allow editing of the content or only view it.',
    },
    tabindex: {
      type: Number,
      default: null,
      description: 'The html tabindex to use for tab navigation.',
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
      this.$emit('input', this.$_makeNewItem(newValues));
    },
    $_makeNewItem(newValues) {
      const newItem = { ...this.value, ...newValues };
      if (newValues?.title !== '') this.isNewItem = false;
      if (this.subList && !newItem.subList) {
        newItem.subList = this.subList;
      } else {
        delete newItem.subList;
      }
      if (!this.isNewItem) delete newItem.isNewItem;
      return newItem;
    },
    invalidateNewItem(newValue) {
      if (this.isNewItem && (newValue !== '' || !!newValue)) {
        this.isNewItem = false;
        this.emitUpdate({ title: newValue, isNewItem: false });
      }
    },
    emitDelete() {
      this.$emit('delete');
    },
    deactivate() {
      this.isActive = false;
      this.$emit('blur', {
        ...this.value, title: this.title, isNewItem: this.isNewItem, subList: this.subList,
      });
    },
    activate() {
      this.isActive = !this.readOnly;
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
::v-deep .theme--light.v-text-field--solo > .v-input__control > .v-input__slot,
::v-deep .theme--dark.v-text-field--solo > .v-input__control > .v-input__slot {
  background: none;
}
</style>
