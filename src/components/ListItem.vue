<template>
  <div class="list-item-view">
    <template>
      <v-text-field
        :readonly="readOnly"
        dense
        :single-line="readOnly"
        :flat="readOnly"
        :solo="readOnly"
        :value="listItem.title"
        @change="listItem.title = $event"
        @input="updateText($event)"
        :outlined="isActive"
        @click.prevent="activate"
        @blur="deactivate"
        :placeholder="placeholder"
        :hide-details="readOnly"
        >
          <v-icon
            slot="prepend-inner"
            class="listitem-icon"
            :outlined="isActive"
            @click.prevent="cycleIcon"
            @blur="deactivate"
            :title="iconTitle"
          >{{icon}}</v-icon>
          {{ listItem.isNewItem ? '' : listItem.title }}</v-text-field
      >
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    readOnly: {
      type: Boolean,
      default: false,
      description: 'Whether to allow editing of the content or only view it.',
    },
  },
  data: () => ({
    isActive: false,
    currentStateIdx: 0,
  }),
  methods: {
    deactivate() {
      this.isActive = false;
      this.$emit('blur', this.listItem);
    },
    activate() {
      this.isActive = !this.readOnly;
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
  },
  computed: {
    ...mapGetters(['itemStates']),
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
