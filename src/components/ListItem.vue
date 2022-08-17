<template>
  <div class="list-item-view">
    <v-text-field
      ref="input"
      :model-value="title"
      test-text-field
      dense
      :clearable="!readOnly"
      :flat="readOnly"
      :hide-details="readOnly"
      :outlined="isActive"
      :placeholder="placeholder"
      :readonly="readOnly"
      :single-line="readOnly"
      @blur="deactivate"
      :solo="readOnly"
      @click.prevent="activate"
      :tabindex="tabindex"
      @keydown.enter.prevent="emitEnterPressed({ title })"
      :color="currentColor"
      @update:modelValue="emitUpdate({ title: $event })"
    >
    <template v-slot:prepend-inner>
      <v-icon
        class="listitem-icon"
        :outlined="isActive"
        :title="iconTitle"
        :color="currentColor"
        @click.prevent="cycleIcon"
        @blur="deactivate"
      >
        {{ icon }}
      </v-icon>
      </template>
      {{ isNewItem ? '' : title }}
      <template v-slot:append>
      <v-btn
        v-if="showAddSubListButton"
        :loading="creatingSubList"
        :disabled="creatingSubList"
        title="Make a new sublist from this item."
        test-make-sublist
        icon
        @click="makeSublist"
      >
        <i
          class="ql ql-plus"
          style="font-size:140%"
        />
      </v-btn>
      <v-btn
        v-if="subList"
        icon
        test-sublist-link-icon
        :title="`${readOnly ? '' : 'Edit /'}View Sublist`"
        @click="updateItem({ to: subListPath })"
      >
        <i class="ql ql-link" />
      </v-btn>
      <v-btn
        v-if="!isNewItem"
        icon
        title="delete"
        test-delete-icon
        @click="emitDelete"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  createList, stateGroupsCollection, getStateGroup, computeSubListPath as computeSubListPathFB,
} from '../firebase';

// TODO: use states.value instead of states[index] for saving/storing state values.

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
    currentStateValue: 0, // the value if the icon
    subListSlug: '',
    subListPath: '',
    subList: null,
    creatingSubList: false,
    listId: '',
  }),
  async mounted() {
    this.title = this.$props.value.title;
    this.isNewItem = this.$props.value.isNewItem;
    this.listId = this.$props.value.listId;
    if (this.$props.value.state?.value) {
      this.currentStateValue = parseInt(this.$props.value.state.value, 10) || this.$props.states[0].value;
    }
    if (this.value.subList) {
      await this.computeSubListPath(this.value.subList);
      this.subList = this.value.subList;
    }
  },
  methods: {
    emitUpdate(newValues) {
      this.$emit('input', this.$_makeNewItem(newValues));
    },
    emitEnterPressed(newValues) {
      this.$emit('enterPressed', newValues);
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
      this.updateItem();
    },
    activate() {
      this.isActive = !this.readOnly;
    },
    cycleIcon() {
      if (this.isNewItem) return;
      this.activate();
      let nextIdx = (this.currentStateIdx || 0) + 1;
      if (nextIdx > this.states.length - 1) nextIdx = 0;
      this.currentStateIdx = nextIdx;
      this.currentStateValue = this.states[nextIdx]?.value;
    },
    updateItem({ to } = {}) {
      if (this.isNewItem) return;
      this.$emit('update', {
        ...this.value,
        title: this.title,
        state: this.states.find((state) => state.value === this.currentStateValue),
        isNewItem: this.isNewItem,
        subList: this.subList,
      });
      if (to) {
        this.$nextTick(() => {
          this.$router.push(to);
        });
      }
    },
    async makeSublist() {
      this.creatingSubList = true;
      const stateGroupDoc = this.getGlobalPreferences.defaultStateGroup;
      const stateGroup = getStateGroup(stateGroupsCollection, stateGroupDoc.id);
      const payload = {
        title: this.title,
        description: `sublist of ${this.title}`, // same as title
        stateGroup,
      };
      this.subList = await createList(payload);
      this.subListSlug = this.subList.slug;
      await this.computeSubListPath(this.subList);
      this.updateItem();
      this.creatingSubList = false;
    },
    async computeSubListPath(subListRef) {
      const subListPath = await computeSubListPathFB(subListRef, this.$route.path);
      if (!subListPath) return;
      this.subListPath = subListPath;
    },
  },
  computed: {
    ...mapGetters(['getGlobalPreferences']),
    showAddSubListButton() {
      if (this.readOnly) return false;
      if (this.isNewItem) return false;
      if (this.subList !== null) return false;
      if (!this.title || this.title === '') return false;
      return true;
    },
    currentColor() {
      return this.states[this.currentStateIdx]?.color;
    },

    icon() {
      if (this.isNewItem) return 'mdi-plus';
      let currentStateIdx = this.states.findIndex((state) => state.value === this.currentStateValue);
      if (currentStateIdx < 0) {
        currentStateIdx = 0;
        return 'mdi-help-box';
      }
      return this.states[currentStateIdx || 0]?.icon;
    },
    iconTitle() {
      return this.states[this.currentStateIdx || 0]?.text;
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
  // display: inline-block;
}
:deep(.theme--light.v-text-field--solo > .v-input__control > .v-input__slot),
:deep(.theme--dark.v-text-field--solo > .v-input__control > .v-input__slot) {
  background: none;
  align-items: center;
}
:deep(v-text-field.v-input--dense:not(.v-text-field--outlined) .v-text-field__prefix),
:deep(.v-text-field.v-input--dense:not(.v-text-field--outlined) .v-text-field__suffix),
:deep(.v-text-field.v-input--dense:not(.v-text-field--outlined) input) {
    padding: 0;
  align-items: center;
  margin-top: -10px;
}
:deep(.v-input__append-inner button) {
  margin-top: -3px;
}
</style>
