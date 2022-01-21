<template>
    <v-text-field test-text-field :value.sync="item.text" @input="isChanging($event)" @blur="updateText">
      <v-icon v-if="isDraggable" slot="prepend" class="drag-handle">drag_indicator</v-icon>
      <icon-state slot="prepend-inner" :icon.sync="item.icon"></icon-state>
      <v-icon test-delete-icon v-if="!item.isNewItem" slot="append-outer" @click="del(item)">close_thick</v-icon>
    </v-text-field>
</template>
<script>
import IconState from './IconState.vue';

export default {
  props: ['item', 'isDraggable'],
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
      this.$emit('blur', { icon: this.item.icon, text: $event.target.value });
    },
    isChanging(evt) {
      this.$emit('update:item', { icon: this.item.icon, text: evt });
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
