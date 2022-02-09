<template>
  <v-text-field test-text-field v-model="text" @input="updateItem">
    <v-icon v-if="isDraggable" slot="prepend" class="drag-handle">drag_indicator</v-icon>
    <icon-state slot="prepend-inner" :icon.sync="icon"></icon-state>
    <ColorSwatch slot="append" :outline="false" v-if="!item.isNewItem" @colorChange="changeColor($event)" />
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
  components: {
    IconState,
    ColorSwatch,
  },
  data() {
    return {
      text: this.item.text,
      listColor: this.item.color,
      icon: this.item.icon,
    };
  },
  mounted() {
    this.text = this.item.text;
    this.listColor = this.item.color;
    this.icon = this.item.icon;
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
// .list-state {
//   align-items: center;
// }
// .icon-state {
//   width: 30px;
//   margin-right: 10px;
//   display: inline-block;
// }
// .drag-handle {
//   padding-right: 10px;
// }
// .v-row {
//   display: inline-flex;
// }
</style>
