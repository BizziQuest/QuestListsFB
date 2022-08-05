<template>
  <v-text-field
    ref="input"
    :model-value="item.text"
    test-text-field
    :dense="compact"
    placeholder="New Item"
    @keydown.enter="$emit('enterPressed')"
    @keydown.tab.prevent="$emit('enterPressed')"
    @input="isChanging($event)"
    @blur="updateText"
  >
    <template v-slot:prepend>
    <v-icon
      v-if="isDraggable"
      class="drag-handle"
    >
      drag_indicator
    </v-icon>
    </template>
    <template v-slot:prepend-inner>
    <icon-state

      v-model:icon="icon"
      :color="listColor"
    />
    </template>
    <template v-slot:append>
    <color-swatch
      v-if="!item.isNewItem"
      v-model="listColor"
      :outline="false"
    />
    </template>
    <template v-slot:append-outer>
    <v-btn
      v-if="!item.isNewItem"
      icon
      test-delete-icon
      @click="del(item)"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    </template>
  </v-text-field>
</template>
<script>
import IconState from './IconState.vue';
import ColorSwatch from './ColorSwatch.vue';

export default {
  components: {
    IconState,
    ColorSwatch,
  },
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
