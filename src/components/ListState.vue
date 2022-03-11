<template>
  <v-text-field test-text-field v-model="text" @input="updateItem">
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
  watch: {
    item(val) {
      this.listColor = val.color;
    },
  },
  methods: {
    updateItem() {
      this.$emit('update:item', {
        ...this.item,
        icon: this.icon,
        text: this.text,
        color: this.listColor,
      });
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
</style>
