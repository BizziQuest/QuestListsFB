<template>
  <v-text-field test-text-field ref="input" :dense="compact" placeholder="New Item" :value.sync="item.text"
    @keydown.enter="$emit('enterPressed')" @keydown.tab.prevent="$emit('enterPressed')" @input="isChanging($event)"
    @blur="updateText">
    <v-icon v-if="isDraggable" slot="prepend" class="drag-handle">drag_indicator</v-icon>
    <icon-state slot="prepend-inner"  :color="listColor"  :icon.sync="icon"></icon-state>
    <color-swatch slot="append" :outline="false" v-if="!item.isNewItem" v-model="listColor" />
    <v-btn icon slot="append-outer" v-if="!item.isNewItem" test-delete-icon @click="del(item)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-text-field>
</template>
<script>
import IconState from './IconState.vue';
import ColorSwatch from './ColorSwatch.vue';

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
    ColorSwatch,
  },
  props: {
    item: {
      type: Object,
      description: 'The initial state of this component.',
    },
    isDraggable: {
      type: Boolean,
      description: 'Whether this item should be draggable',
    },
    isNewItem: {
      type: Boolean,
      description: 'Whether this item is a new item field.',
      default: false,
    },
  },
  data() {
    return {
      text: this.item.text,
      listColor: this.item.color,
      icon: this.item.icon,
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
    changeColor($event) {
      this.listColor = $event;
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
