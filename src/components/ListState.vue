<template>
  <v-text-field test-text-field ref="input" :dense="compact" placeholder="New Item" :value.sync="item.text"
    @keydown.enter="$emit('enterPressed')" @keydown.tab.prevent="$emit('enterPressed')" @input="isChanging($event)"
    @blur="updateText">
    <v-icon v-if="isDraggable" slot="prepend" class="drag-handle">drag_indicator</v-icon>
    <icon-state slot="prepend-inner" :icon.sync="item.icon"></icon-state>
    <v-btn icon slot="append" title="delete" test-delete-icon v-if="!item.isNewItem" @click="del(item)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-text-field>
</template>
<script>
import IconState from './IconState.vue';

export default {
  props: {
    item: {
      description: 'The list state item we are editing',
      type: Object,
      default: () => ({}),
    },
    isDraggable: {
      description: 'Whether to show the drag handle and enable drag and drop.',
      type: Boolean,
      default: false,
    },
    compact: {
      description: 'Whether to show a compact UI.',
      type: Boolean,
      default: false,
    },
  },
  components: {
    IconState,
  },
  data() {
    return {
      text: this.item.text,
    };
  },
  methods: {
    updateText($event) {
      this.$emit('blur', { ...this.item, text: $event.target.value });
    },
    isChanging(evt) {
      this.$emit('update:item', { ...this.item, text: evt });
    },
    del(item) {
      this.$emit('delete:item', item);
    },
  },
};
</script>
<style scoped lang="scss">
.list-state {
  align-items: center;
}

.icon-state {
  width: 30px;
  margin-right: 10px;
  display: inline-block;
}

.drag-handle {
  padding-right: 10px;
}
</style>
