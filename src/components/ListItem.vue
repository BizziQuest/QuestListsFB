<template>
  <div class="list-item-view">
    <v-text-field
      :clearable="!readOnly"
      :color="currentColor"
      :flat="readOnly"
      :hide-details="readOnly"
      :model-value="modelValue.title"
      :outlined="modelValue.isActive"
      :placeholder="placeholder"
      :readonly="readOnly"
      :single-line="readOnly"
      :solo="readOnly"
      :tabindex="tabindex"
      @blur="deactivate"
      @click.prevent="activate"
      @keydown.enter.prevent="emitEnterPressed"
      @update:modelValue="updateData({ title: $event })"
      dense
      ref="input"
      test-text-field
    >
    <template v-slot:prepend-inner>
      <v-icon
        class="listitem-icon"
        :outlined="modelValue.isActive"
        :title="iconTitle"
        :color="currentColor"
        @click.prevent="cycleIcon"
        @blur="deactivate"
      >
        {{ icon }}
      </v-icon>
      </template>
      <template v-slot:append>
      <v-btn
        v-if="showAddSubListButton"
        class="px-0"
        :loading="creatingSubList"
        :disabled="creatingSubList"
        title="Make a new sublist from this item."
        test-make-sublist
        variant="text"
        @click="makeSublist"
        icon="ql ql-plus"
      >
        <i
          class="ql ql-plus"
          style="font-size:140%"
        />
      </v-btn>
      <v-btn
        v-if="modelValue.subList"
        test-sublist-link-icon
        :title="`${readOnly ? '' : 'Edit /'}View Sublist`"
        variant="text"
        @click="saveItem({ to: modelValue.subListPath })"
      >
        <i class="ql ql-link" />
      </v-btn>
      <v-btn
        v-if="!isNewItem"
        title="delete"
        test-delete-icon
        variant="text"
        @click="emitDelete"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import {
  createList, stateGroupsCollection, getStateGroup, computeSubListPath as computeSubListPathFB, createSubList
} from '../firebase';

// TODO: use states.value instead of states[index] for saving/storing state values.

/** @typedef {object} modelValue
 * @property {boolean} isActive
 * @property {boolean} isNewItem
 * @property {string} title
 * @property {boolean} currentStateIdx
 * @property {boolean} currentStateValue
 * @property {boolean} subListSlug
 * @property {boolean} subListPath
 * @property {boolean} subList
 * @property {boolean} listId
 *
*/
export default {
  props: {

    /** @type {modelValue} */
    modelValue: {
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
    isNewItem: {
      type: Boolean,
      default: false,
      description: 'Whether this is a new, empty item at the end of a list.',
    },
    tabindex: {
      type: Number,
      default: null,
      description: 'The html tabindex to use for tab navigation.',
    },
  },
  data: () => ({
    creatingSubList: false,
  }),
  methods: {
    emitEnterPressed() {
      this.$emit('enterPressed');
    },
    emitDelete() {
      this.$emit('delete');
    },
    deactivate() {
      if (this.modelValue.title || this.modelValue.icon) {
        this.$emit('update',  {...this.modelValue, isNewItem: false});
      }
      this.isActive = false;
    },
    activate() {
      this.isActive = !this.readOnly;
    },
    cycleIcon() {
      if (this.isNewItem) return;
      this.activate();
      let nextIdx = (this.modelValue?.currentStateIdx || 0) + 1;
      if (nextIdx > this.states.length - 1) nextIdx = 0;
      this.updateData({
        currentStateIdx: nextIdx,
        currentStateValue: this.states[nextIdx]?.value
      });
    },
    updateData(data) {
      this.$emit('update:modelValue', {...this.modelValue, ...data, isNewItem: false});
    },
    saveItem({to}) {
      this.$emit('update', {...this.modelValue, skipUpdate: !!to})
      if (to) {
        this.$nextTick(() => {
          this.$router.push(to);
        });
      }
    },
    // TODO: move this to firebase.js
    async makeSublist() {
      this.creatingSubList = true;
      const listWithSubList = await createSubList(this.modelValue, this.$route.path, this.globalPreferences.defaultStateGroup);
      this.$emit('update', listWithSubList);
      this.creatingSubList = false;
    },
  },
  computed: {
    ...mapState([ 'globalPreferences']),
    showAddSubListButton() {
      if (this.readOnly) return false;
      if (this.isNewItem) return false;
      if (this.modelValue.subList) return false;
      if (!this.modelValue.title || this.modelValue.title === '') return false;
      return true;
    },
    currentColor() {
      return this.states[this.modelValue?.currentStateIdx]?.color;
    },

    icon() {
      if (this.isNewItem) return 'mdi-plus';
      let firstStateIndex = 0;
      if (!this.modelValue.currentStateValue) {
        let currentOrder = this.states[0].order;
        this.states.forEach((state, index) => {
          if(state.order > currentOrder) return;
          currentOrder = state.order;
          firstStateIndex = index;
        });
      }
      let currentStateIdx = this.states.findIndex((state) => state.value === (this.modelValue.currentStateValue || this.states[firstStateIndex].value) );
      if (currentStateIdx < 0) {
        return 'mdi-help-box';
      }
      return this.states[currentStateIdx || 0]?.icon;
    },
    iconTitle() {
      return this.states[this.modelValue?.currentStateIdx || 0]?.text;
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
